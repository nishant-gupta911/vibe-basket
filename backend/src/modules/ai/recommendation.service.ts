import { PrismaService } from '../../config/prisma.service';
import { embeddingService } from './embedding.service';
import { findMoodConfig, MoodConfig } from './mood-config';

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

interface Product {
  id: string;
  title: string;
  description: string | null;
  category: string;
  price: number;
  image: string | null;
}

export class RecommendationService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate mood-based product recommendations using deterministic logic
   * NO AI APIs - pure rule-based matching
   */
  async getMoodRecommendations(request: MoodRequest): Promise<MoodRecommendation> {
    try {
      // Step 1: Find the matching mood configuration
      const config = findMoodConfig(request.mood, request.occasion);
      
      if (!config) {
        return { suggestions: [] };
      }

      // Step 2: Get all products within budget and in stock
      const allProducts = await this.prisma.product.findMany({
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

      if (allProducts.length === 0) {
        return { suggestions: [] };
      }

      // Step 3: Filter products based on mood configuration
      const filteredProducts = this.filterProductsByMoodConfig(allProducts, config);

      if (filteredProducts.length === 0) {
        // If no products match the specific config, return top products within budget
        const fallbackProducts = this.selectTopProducts(allProducts, request.budget, config, 3);
        return {
          suggestions: fallbackProducts.map(p => ({
            productId: p.id,
            reason: `A great choice for ${request.occasion.toLowerCase()} within your budget!`,
            product: {
              id: p.id,
              title: p.title,
              price: p.price,
              image: p.image || '',
              category: p.category,
            },
          })),
        };
      }

      // Step 4: Score and rank the filtered products
      const scoredProducts = this.scoreProducts(filteredProducts, config, request.budget);

      // Step 5: Select top 3-5 products
      const topProducts = scoredProducts.slice(0, 5);

      // Step 6: Build recommendations with explanations
      const suggestions: ProductSuggestion[] = topProducts.map((scored) => ({
        productId: scored.product.id,
        reason: config.explanation,
        product: {
          id: scored.product.id,
          title: scored.product.title,
          price: scored.product.price,
          image: scored.product.image || '',
          category: scored.product.category,
        },
      }));

      return { suggestions };
    } catch (error: any) {
      console.error('Mood recommendation error:', error);
      throw new Error('Failed to generate recommendations');
    }
  }

  /**
   * Filter products based on mood configuration
   * Returns products that match allowed categories and keywords
   */
  private filterProductsByMoodConfig(
    products: Product[],
    config: MoodConfig
  ): Product[] {
    return products.filter((product) => {
      // Check if product category is allowed
      const categoryMatch = config.allowedCategories.some(
        (cat) => cat.toLowerCase() === product.category.toLowerCase()
      );

      if (!categoryMatch) {
        return false;
      }

      // If no keywords specified, include all products in allowed categories
      if (config.keywords.length === 0) {
        return true;
      }

      // Check if product title or description contains any keywords
      const text = `${product.title} ${product.description || ''}`.toLowerCase();
      const keywordMatch = config.keywords.some((keyword) =>
        text.includes(keyword.toLowerCase())
      );

      return keywordMatch;
    });
  }

  /**
   * Score and rank products based on multiple factors
   * Higher score = better match
   */
  private scoreProducts(
    products: Product[],
    config: MoodConfig,
    budget: number
  ): Array<{ product: Product; score: number }> {
    const targetPrice = budget * config.budgetMultiplier;

    const scoredProducts = products.map((product) => {
      let score = 0;

      // Factor 1: Price optimization (40 points max)
      // Products closest to target price get highest score
      const priceDiff = Math.abs(product.price - targetPrice);
      const priceScore = Math.max(0, 40 - (priceDiff / targetPrice) * 40);
      score += priceScore;

      // Factor 2: Keyword relevance (30 points max)
      const text = `${product.title} ${product.description || ''}`.toLowerCase();
      const keywordMatches = config.keywords.filter((keyword) =>
        text.includes(keyword.toLowerCase())
      ).length;
      const keywordScore = Math.min(30, keywordMatches * 10);
      score += keywordScore;

      // Factor 3: Category priority (30 points)
      // First category in allowedCategories gets full points
      const categoryIndex = config.allowedCategories.findIndex(
        (cat) => cat.toLowerCase() === product.category.toLowerCase()
      );
      const categoryScore = categoryIndex === -1 ? 0 : 30 - categoryIndex * 5;
      score += Math.max(0, categoryScore);

      return { product, score };
    });

    // Sort by score (highest first)
    return scoredProducts.sort((a, b) => b.score - a.score);
  }

  /**
   * Select top products when no specific matches found
   * Uses simple heuristics: category diversity + price optimization
   */
  private selectTopProducts(
    products: Product[],
    budget: number,
    config: MoodConfig,
    count: number
  ): Product[] {
    const targetPrice = budget * 0.7;
    
    // Sort by how close to target price
    const sorted = products
      .map((p) => ({
        product: p,
        diff: Math.abs(p.price - targetPrice),
      }))
      .sort((a, b) => a.diff - b.diff);

    // Select products with category diversity
    const selected: Product[] = [];
    const usedCategories = new Set<string>();

    for (const item of sorted) {
      if (selected.length >= count) break;
      
      // Prefer products from different categories
      if (!usedCategories.has(item.product.category)) {
        selected.push(item.product);
        usedCategories.add(item.product.category);
      }
    }

    // Fill remaining slots if needed
    for (const item of sorted) {
      if (selected.length >= count) break;
      if (!selected.find((p) => p.id === item.product.id)) {
        selected.push(item.product);
      }
    }

    return selected;
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
