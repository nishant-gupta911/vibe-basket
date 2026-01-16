"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotService = void 0;
const openai_1 = __importDefault(require("openai"));
const embedding_service_1 = require("./embedding.service");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
class ChatbotService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async chat(message, conversationHistory = []) {
        try {
            const products = await this.prisma.product.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    category: true,
                    price: true,
                },
                take: 20,
            });
            const productContext = products
                .map((p) => `ID: ${p.id}, Title: ${p.title}, Category: ${p.category}, Price: $${p.price}, Description: ${p.description || 'N/A'}`)
                .join('\n');
            const systemPrompt = `You are a helpful shopping assistant for an e-commerce store. 
Help users find products based on their needs and preferences.

Available Products:
${productContext}

When recommending products, include their IDs in your response using the format: [PRODUCT_IDS: id1, id2, id3]
Be conversational, helpful, and concise. If no products match, suggest alternatives or ask clarifying questions.`;
            const messages = [
                { role: 'system', content: systemPrompt },
                ...conversationHistory,
                { role: 'user', content: message },
            ];
            const completion = await openai.chat.completions.create({
                model: process.env.AI_MODEL || 'gpt-4o-mini',
                messages: messages,
                temperature: 0.7,
                max_tokens: 500,
            });
            const reply = completion.choices[0].message.content || 'Sorry, I could not process your request.';
            const productIds = this.extractProductIds(reply, products.map((p) => p.id));
            const cleanReply = reply.replace(/\[PRODUCT_IDS:.*?\]/g, '').trim();
            return {
                reply: cleanReply,
                productIds: productIds.length > 0 ? productIds : null,
            };
        }
        catch (error) {
            console.error('Chatbot error:', error);
            if (error.status === 401) {
                throw new Error('OpenAI API key is invalid');
            }
            if (error.status === 429) {
                throw new Error('OpenAI API quota exceeded. Please check your billing.');
            }
            throw new Error('Failed to process chat message');
        }
    }
    async semanticSearch(query, limit = 5) {
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
    extractProductIds(text, validIds) {
        const matches = text.match(/\[PRODUCT_IDS:(.*?)\]/);
        if (!matches)
            return [];
        const ids = matches[1]
            .split(',')
            .map((id) => id.trim())
            .filter((id) => validIds.includes(id));
        return ids;
    }
}
exports.ChatbotService = ChatbotService;
//# sourceMappingURL=chatbot.service.js.map