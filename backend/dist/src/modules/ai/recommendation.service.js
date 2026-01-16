"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationService = void 0;
const openai_1 = __importDefault(require("openai"));
const embedding_service_1 = require("./embedding.service");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
class RecommendationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMoodRecommendations(request) {
        try {
            const products = await this.prisma.product.findMany({
                where: {
                    price: {
                        lte: request.budget,
                    },
                    inStock: true,
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    category: true,
                    price: true,
                    image: true,
                },
            });
            if (products.length === 0) {
                return { suggestions: [] };
            }
            const productContext = products
                .map((p) => `ID: ${p.id}, Title: ${p.title}, Category: ${p.category}, Price: $${p.price}`)
                .join('\n');
            const userProfile = `
Occasion: ${request.occasion}
Mood: ${request.mood}
Budget: $${request.budget}
${request.gender ? `Gender: ${request.gender}` : ''}
${request.age ? `Age: ${request.age}` : ''}
`;
            const prompt = `You are a personal shopping assistant. Based on the user's profile, recommend 3-5 products that best match their needs.

User Profile:
${userProfile}

Available Products:
${productContext}

For each recommended product, provide:
1. The product ID
2. A brief reason (1-2 sentences) why it's perfect for them

Format your response as JSON:
[
  { "productId": "id", "reason": "why this product fits" }
]

Only recommend products from the list above. Consider the occasion, mood, and budget.`;
            const completion = await openai.chat.completions.create({
                model: process.env.AI_MODEL || 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.8,
                response_format: { type: 'json_object' },
            });
            const response = completion.choices[0].message.content;
            let recommendations;
            try {
                const parsed = JSON.parse(response || '{}');
                recommendations = parsed.recommendations || parsed.suggestions || [];
            }
            catch (e) {
                console.error('Failed to parse AI response:', e);
                recommendations = [];
            }
            const validRecommendations = [];
            for (const rec of recommendations) {
                const product = products.find((p) => p.id === rec.productId);
                if (product) {
                    validRecommendations.push({
                        productId: rec.productId,
                        reason: rec.reason,
                        product: {
                            id: product.id,
                            title: product.title,
                            price: product.price,
                            image: product.image || '',
                            category: product.category,
                        },
                    });
                }
            }
            if (validRecommendations.length === 0) {
                validRecommendations.push(...this.getFallbackRecommendations(products, request).map((p) => ({
                    productId: p.id,
                    reason: `Great choice for ${request.occasion} within your budget`,
                    product: {
                        id: p.id,
                        title: p.title,
                        price: p.price,
                        image: p.image || '',
                        category: p.category,
                    },
                })));
            }
            return {
                suggestions: validRecommendations.slice(0, 5),
            };
        }
        catch (error) {
            console.error('Mood recommendation error:', error);
            if (error.status === 401) {
                throw new Error('OpenAI API key is invalid');
            }
            if (error.status === 429) {
                throw new Error('OpenAI API quota exceeded. Please check your billing.');
            }
            throw new Error('Failed to generate recommendations');
        }
    }
    getFallbackRecommendations(products, request) {
        return products
            .sort((a, b) => {
            const aDiff = Math.abs(a.price - request.budget * 0.8);
            const bDiff = Math.abs(b.price - request.budget * 0.8);
            return aDiff - bDiff;
        })
            .slice(0, 3);
    }
    async semanticProductSearch(query, limit = 10) {
        try {
            const queryEmbedding = await embedding_service_1.embeddingService.generateEmbedding(query);
            const products = await this.prisma.$queryRaw `
        SELECT id, (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as distance
        FROM "Product"
        WHERE embedding IS NOT NULL
        ORDER BY distance
        LIMIT ${limit}
      `;
            return products.map((p) => p.id);
        }
        catch (error) {
            console.error('Semantic search error:', error);
            return [];
        }
    }
}
exports.RecommendationService = RecommendationService;
//# sourceMappingURL=recommendation.service.js.map