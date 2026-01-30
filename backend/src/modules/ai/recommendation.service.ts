/**
 * MOOD-BASED SHOPPING STYLIST - RECOMMENDATION ENGINE
 * 
 * Translates user mood + occasion into smart product recommendations.
 * Uses intent-based matching with tag scoring.
 * 
 * Core Philosophy:
 * - Be helpful, not strict
 * - Explain recommendations clearly
 * - Respect budget absolutely
 * - Feel human, not robotic
 */

import { PrismaService } from '../../config/prisma.service';
import {
  findMoodProfile,
  MoodProfile,
  PRODUCT_TAGS,
  BUDGET_STRATEGIES,
} from './mood-profiles';

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

interface ScoredProduct {
  product: Product;
  score: number;
  matchedTags: string[];
}

export class RecommendationService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate mood-based recommendations
   * Main entry point for the shopping stylist
   */
  async getMoodRecommendations(request: MoodRequest): Promise<MoodRecommendation> {
    try {
      // Step 1: Find the mood profile (intent mapping)
      const profile = findMoodProfile(request.mood, request.occasion);
      
      if (!profile) {
        return { suggestions: [] };
      }

      // Step 2: Fetch products within budget (strict enforcement)
      const products = await this.fetchProductsWithinBudget(request.budget);

      if (products.length === 0) {
        return { suggestions: [] };
      }

      // Step 3: Filter by preferred categories
      const categoryFiltered = this.filterByCategories(products, profile);

      if (categoryFiltered.length === 0) {
        // Fallback: show top products in any category within budget
        return this.generateFallbackRecommendations(products, profile, request.budget);
      }

      // Step 4: Score products using intent tags
      const scoredProducts = this.scoreProductsByIntent(categoryFiltered, profile, request.budget);

      // Step 5: Remove products with avoid tags
      const validProducts = this.filterByAvoidTags(scoredProducts, profile);

      if (validProducts.length === 0) {
        return this.generateFallbackRecommendations(products, profile, request.budget);
      }

      // Step 6: Select top 3-5 diverse products
      const topProducts = this.selectDiverseProducts(validProducts, 5);

      // Step 7: Build recommendation responses with explanations
      const suggestions = this.buildSuggestions(topProducts, profile);

      return { suggestions };

    } catch (error: any) {
      console.error('Mood recommendation error:', error);
      throw new Error('Failed to generate recommendations');
    }
  }

  /**
   * Fetch all products within budget
   * Budget is STRICTLY enforced - never show products above budget
   */
  private async fetchProductsWithinBudget(budget: number): Promise<Product[]> {
    return await this.prisma.product.findMany({
      where: {
        price: {
          lte: budget, // STRICT: Less than or equal to budget
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
  }

  /**
   * Filter products by preferred categories
   */
  private filterByCategories(
    products: Product[],
    profile: MoodProfile
  ): Product[] {
    return products.filter((product) =>
      profile.preferredCategories.some(
        (cat) => cat.toLowerCase() === product.category.toLowerCase()
      )
    );
  }

  /**
   * Score products based on intent tag matches
   * Higher score = better match for the mood/occasion
   */
  private scoreProductsByIntent(
    products: Product[],
    profile: MoodProfile,
    budget: number
  ): ScoredProduct[] {
    // Calculate target price based on budget strategy
    const targetPrice = budget * BUDGET_STRATEGIES[profile.budgetStrategy];

    return products.map((product) => {
      let score = 0;
      const matchedTags: string[] = [];
      const productText = `${product.title} ${product.description || ''}`.toLowerCase();

      // Factor 1: Intent tag matching (50 points max)
      // Check each intent tag and see if related product tags appear
      for (const intentTag of profile.intentTags) {
        const relatedProductTags = PRODUCT_TAGS[intentTag] || [];
        
        for (const productTag of relatedProductTags) {
          if (productText.includes(productTag.toLowerCase())) {
            score += 10; // 10 points per matched tag
            matchedTags.push(productTag);
            break; // One match per intent tag is enough
          }
        }
      }
      score = Math.min(score, 50); // Cap at 50 points

      // Factor 2: Price optimization (30 points max)
      // Products close to target price score higher
      const priceDiff = Math.abs(product.price - targetPrice);
      const priceScore = Math.max(0, 30 - (priceDiff / targetPrice) * 30);
      score += priceScore;

      // Factor 3: Category priority (20 points)
      // Earlier categories in the list get higher scores
      const categoryIndex = profile.preferredCategories.findIndex(
        (cat) => cat.toLowerCase() === product.category.toLowerCase()
      );
      const categoryScore = categoryIndex === -1 ? 0 : 20 - categoryIndex * 3;
      score += Math.max(0, categoryScore);

      return {
        product,
        score,
        matchedTags,
      };
    });
  }

  /**
   * Filter out products that have avoid tags
   */
  private filterByAvoidTags(
    scoredProducts: ScoredProduct[],
    profile: MoodProfile
  ): ScoredProduct[] {
    if (!profile.avoidTags || profile.avoidTags.length === 0) {
      return scoredProducts;
    }

    return scoredProducts.filter((scored) => {
      const productText = `${scored.product.title} ${scored.product.description || ''}`.toLowerCase();

      // Check if product contains any avoid tags
      for (const avoidTag of profile.avoidTags) {
        const relatedProductTags = PRODUCT_TAGS[avoidTag] || [];
        
        for (const productTag of relatedProductTags) {
          if (productText.includes(productTag.toLowerCase())) {
            return false; // Exclude this product
          }
        }
      }

      return true; // Keep this product
    });
  }

  /**
   * Select diverse products (avoid showing all from same category)
   * Returns top N products with category diversity
   */
  private selectDiverseProducts(
    scoredProducts: ScoredProduct[],
    count: number
  ): ScoredProduct[] {
    // Sort by score (highest first)
    const sorted = [...scoredProducts].sort((a, b) => b.score - a.score);

    const selected: ScoredProduct[] = [];
    const usedCategories = new Set<string>();

    // First pass: select highest scoring from different categories
    for (const item of sorted) {
      if (selected.length >= count) break;
      
      if (!usedCategories.has(item.product.category)) {
        selected.push(item);
        usedCategories.add(item.product.category);
      }
    }

    // Second pass: fill remaining slots with highest scores
    for (const item of sorted) {
      if (selected.length >= count) break;
      
      if (!selected.find((s) => s.product.id === item.product.id)) {
        selected.push(item);
      }
    }

    return selected;
  }

  /**
   * Build final suggestion objects with explanations
   */
  private buildSuggestions(
    scoredProducts: ScoredProduct[],
    profile: MoodProfile
  ): ProductSuggestion[] {
    return scoredProducts.map((scored) => {
      // Personalize explanation if we matched specific tags
      let reason = profile.explanationTemplate;
      
      // Add specific match info if available
      if (scored.matchedTags.length > 0) {
        const primaryTag = scored.matchedTags[0];
        reason = `${reason} Features ${primaryTag} qualities that align perfectly with your needs.`;
      }

      return {
        productId: scored.product.id,
        reason,
        product: {
          id: scored.product.id,
          title: scored.product.title,
          price: scored.product.price,
          image: scored.product.image || '',
          category: scored.product.category,
        },
      };
    });
  }

  /**
   * Generate fallback recommendations when no tagged matches found
   * Uses simple price + category diversity heuristics
   */
  private generateFallbackRecommendations(
    products: Product[],
    profile: MoodProfile,
    budget: number
  ): MoodRecommendation {
    // Target middle of the budget range
    const targetPrice = budget * 0.7;

    // Score by price proximity
    const scored = products.map((p) => ({
      product: p,
      score: Math.abs(p.price - targetPrice),
      matchedTags: [],
    }));

    // Sort by closest to target price
    scored.sort((a, b) => a.score - b.score);

    // Select diverse products
    const diverse = this.selectDiverseProducts(scored, 3);

    // Build basic suggestions
    const suggestions = diverse.map((scored) => ({
      productId: scored.product.id,
      reason: `A great choice for ${profile.occasion.toLowerCase()} within your budget!`,
      product: {
        id: scored.product.id,
        title: scored.product.title,
        price: scored.product.price,
        image: scored.product.image || '',
        category: scored.product.category,
      },
    }));

    return { suggestions };
  }
}
