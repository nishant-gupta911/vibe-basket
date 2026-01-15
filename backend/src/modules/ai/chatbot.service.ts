import OpenAI from 'openai';
import { PrismaService } from '../../config/prisma.service';
import { embeddingService } from './embedding.service';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  reply: string;
  productIds: string[] | null;
}

export class ChatbotService {
  constructor(private prisma: PrismaService) {}

  /**
   * Process user chat message and return response with relevant products
   */
  async chat(message: string, conversationHistory: ChatMessage[] = []): Promise<ChatResponse> {
    try {
      // Get product context for the AI
      const products = await this.prisma.product.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          price: true,
        },
        take: 20, // Limit for context window
      });

      const productContext = products
        .map(
          (p) =>
            `ID: ${p.id}, Title: ${p.title}, Category: ${p.category}, Price: $${p.price}, Description: ${p.description || 'N/A'}`
        )
        .join('\n');

      const systemPrompt = `You are a helpful shopping assistant for an e-commerce store. 
Help users find products based on their needs and preferences.

Available Products:
${productContext}

When recommending products, include their IDs in your response using the format: [PRODUCT_IDS: id1, id2, id3]
Be conversational, helpful, and concise. If no products match, suggest alternatives or ask clarifying questions.`;

      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: message },
      ];

      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 500,
      });

      const reply = completion.choices[0].message.content || 'Sorry, I could not process your request.';

      // Extract product IDs from response
      const productIds = this.extractProductIds(reply, products.map((p) => p.id));

      // Clean the reply to remove product ID markers
      const cleanReply = reply.replace(/\[PRODUCT_IDS:.*?\]/g, '').trim();

      return {
        reply: cleanReply,
        productIds: productIds.length > 0 ? productIds : null,
      };
    } catch (error) {
      console.error('Chatbot error:', error);
      throw new Error('Failed to process chat message');
    }
  }

  /**
   * Search products using semantic search
   */
  async semanticSearch(query: string, limit: number = 5): Promise<string[]> {
    try {
      // Generate embedding for query
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

  /**
   * Extract product IDs from AI response
   */
  private extractProductIds(text: string, validIds: string[]): string[] {
    const matches = text.match(/\[PRODUCT_IDS:(.*?)\]/);
    if (!matches) return [];

    const ids = matches[1]
      .split(',')
      .map((id) => id.trim())
      .filter((id) => validIds.includes(id));

    return ids;
  }
}
