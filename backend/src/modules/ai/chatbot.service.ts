/**
 * CATALOG-AWARE CONVERSATIONAL SHOPPING ASSISTANT
 * 
 * A soft-grounded, intelligent assistant that helps users find products.
 * Feels natural like ChatGPT but stays grounded in the product catalog.
 * 
 * NO AI APIs - pure rule-based conversational logic
 * Handles: recommendations, search, budget filters, style advice, comparisons
 */

import { PrismaService } from '../../config/prisma.service';
import { classifyIntent, Intent, UserContext } from './intent-classifier';
import { 
  filterProducts, 
  rankProducts, 
  selectTopProducts,
  Product,
  ScoredProduct 
} from './product-ranker';
import { generateResponse } from './response-generator';

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
   * Process user chat message and return intelligent response with relevant products
   * Uses rule-based NLU + product ranking + natural response generation
   */
  async chat(message: string, conversationHistory: ChatMessage[] = []): Promise<ChatResponse> {
    try {
      const memory = this.buildMemory(conversationHistory);

      // Use memory to augment message context lightly (no sensitive data)
      const memoryContext = memory
        .filter((msg) => msg.role === 'user')
        .map((msg) => msg.content)
        .join(' | ');

      // Step 1: Classify user intent and extract context
      const classified = classifyIntent(`${memoryContext} ${message}`.trim());

      // Step 2: Handle special cases immediately
      if (classified.intent === Intent.GREETING) {
        return {
          reply: generateResponse(Intent.GREETING, {}, [], message),
          productIds: null,
        };
      }

      if (classified.intent === Intent.OFF_TOPIC) {
        return {
          reply: generateResponse(Intent.OFF_TOPIC, {}, [], message),
          productIds: null,
        };
      }

      // Step 3: Fetch all products from catalog
      const allProducts = await this.prisma.product.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          price: true,
          image: true,
          inStock: true,
        },
      });

      if (allProducts.length === 0) {
        return {
          reply: "I'm sorry, but we don't have any products available right now. Please check back later!",
          productIds: null,
        };
      }

      // Step 4: Filter products based on user context (budget, category, etc.)
      const filteredProducts = filterProducts(allProducts, classified.context);

      // Step 5: Rank products by relevance
      const rankedProducts = rankProducts(
        filteredProducts,
        classified.context,
        message
      );

      // Step 6: Select top products with diversity
      const topProducts = selectTopProducts(rankedProducts, 5);

      // Step 7: Generate natural conversational response
      const reply = generateResponse(
        classified.intent,
        classified.context,
        topProducts,
        message
      );

      // Step 8: Extract product IDs for UI display
      const productIds = topProducts.length > 0
        ? topProducts.map(p => p.product.id)
        : null;

      return {
        reply,
        productIds,
      };

    } catch (error: any) {
      console.error('Chatbot error:', error);
      
      // Graceful error handling - never crash
      return {
        reply: "I'm having a bit of trouble processing that. Could you rephrase your question? I'm here to help you find great products!",
        productIds: null,
      };
    }
  }

  /**
   * Get product recommendations based on use case
   * Used for quick recommendation queries
   */
  async getRecommendations(
    useCase: string,
    budget?: number,
    category?: string
  ): Promise<Product[]> {
    const context: UserContext = {
      useCase,
    };

    if (budget) {
      context.budget = { min: 0, max: budget };
    }

    if (category) {
      context.categories = [category];
    }

    const products = await this.prisma.product.findMany({
      where: {
        inStock: true,
      },
    });

    const filtered = filterProducts(products, context);
    const ranked = rankProducts(filtered, context, useCase);
    const top = selectTopProducts(ranked, 5);

    return top.map(p => p.product);
  }

  buildMemory(history: ChatMessage[] = []): ChatMessage[] {
    const sanitized = history
      .filter((msg) => msg && typeof msg.content === 'string')
      .map((msg) => ({ role: msg.role, content: msg.content.trim() }))
      .filter((msg) => msg.content.length > 0 && msg.content.length < 500);

    if (sanitized.length <= 5) return sanitized;
    return sanitized.slice(-5);
  }
}
