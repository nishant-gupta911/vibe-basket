import OpenAI from 'openai';
import { PrismaService } from '../../config/prisma.service';
import { embeddingService } from './embedding.service';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface MoodRequest {
  occasion: string;
  mood: string;
  budget: number;
  gender?: string;
  age?: number;
}

export interface ProductSuggestion {
  productId: string;
  reason: string;
  product?: {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
  };
}

export interface MoodRecommendation {
  suggestions: ProductSuggestion[];
}

export class RecommendationService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate mood-based product recommendations
   */
  async getMoodRecommendations(request: MoodRequest): Promise<MoodRecommendation> {
    try {
      // Get products within budget
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

      // Build context for AI
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
      let recommendations: ProductSuggestion[];

      try {
        const parsed = JSON.parse(response || '{}');
        recommendations = parsed.recommendations || parsed.suggestions || [];
      } catch (e) {
        console.error('Failed to parse AI response:', e);
        recommendations = [];
      }

      // Validate and enrich recommendations with product details
      const validRecommendations: ProductSuggestion[] = [];

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

      // If AI failed to provide recommendations, use fallback
      if (validRecommendations.length === 0) {
        validRecommendations.push(
          ...this.getFallbackRecommendations(products, request).map((p) => ({
            productId: p.id,
            reason: `Great choice for ${request.occasion} within your budget`,
            product: {
              id: p.id,
              title: p.title,
              price: p.price,
              image: p.image || '',
              category: p.category,
            },
          }))
        );
      }

      return {
        suggestions: validRecommendations.slice(0, 5),
      };
    } catch (error) {
      console.error('Mood recommendation error:', error);
      throw new Error('Failed to generate recommendations');
    }
  }

  /**
   * Fallback recommendations using simple logic
   */
  private getFallbackRecommendations(
    products: any[],
    request: MoodRequest
  ): any[] {
    // Sort by price (closest to budget) and return top 3
    return products
      .sort((a, b) => {
        const aDiff = Math.abs(a.price - request.budget * 0.8);
        const bDiff = Math.abs(b.price - request.budget * 0.8);
        return aDiff - bDiff;
      })
      .slice(0, 3);
  }

  /**
   * Semantic search for products
   */
  async semanticProductSearch(query: string, limit: number = 10): Promise<string[]> {
    try {
      const queryEmbedding = await embeddingService.generateEmbedding(query);

      // Use raw SQL for vector similarity search
      const products: any[] = await this.prisma.$queryRaw`
        SELECT id, (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as distance
        FROM "Product"
        WHERE embedding IS NOT NULL
        ORDER BY distance
        LIMIT ${limit}
      `;

      return products.map((p) => p.id);
    } catch (error) {
      console.error('Semantic search error:', error);
      return [];
    }
  }
}
