/**
 * PRODUCT FILTER & RANKER
 * 
 * Filters and ranks products based on user context and shopping criteria.
 * Uses heuristic scoring to provide relevant recommendations.
 * 
 * NO AI APIs - pure rule-based logic
 */

import { UserContext } from './intent-classifier';

export interface Product {
  id: string;
  title: string;
  description: string | null;
  category: string;
  price: number;
  image: string | null;
  inStock: boolean;
}

export interface ScoredProduct {
  product: Product;
  score: number;
  reasons: string[];
}

/**
 * Filter products based on user context
 */
export function filterProducts(
  products: Product[],
  context: UserContext
): Product[] {
  let filtered = products.filter(p => p.inStock);

  // Filter by budget (strict)
  if (context.budget) {
    filtered = filtered.filter(p => {
      return p.price >= context.budget!.min && p.price <= context.budget!.max;
    });
  }

  // Filter by categories
  if (context.categories && context.categories.length > 0) {
    filtered = filtered.filter(p =>
      context.categories!.some(cat => p.category.toLowerCase() === cat.toLowerCase())
    );
  }

  return filtered;
}

/**
 * Score and rank products based on relevance to user context
 * Higher score = better match
 */
export function rankProducts(
  products: Product[],
  context: UserContext,
  query: string
): ScoredProduct[] {
  const scored = products.map(product => {
    let score = 0;
    const reasons: string[] = [];

    // Base score for being in stock
    score += 10;

    // Budget optimization (40 points)
    if (context.budget) {
      const budgetRange = context.budget.max - context.budget.min;
      const targetPrice = context.budget.min + (budgetRange * 0.7);
      const priceDiff = Math.abs(product.price - targetPrice);
      const priceScore = Math.max(0, 40 - (priceDiff / targetPrice) * 40);
      score += priceScore;

      if (product.price <= context.budget.max * 0.8) {
        reasons.push('great value within your budget');
      }
    }

    // Category match (30 points)
    if (context.categories && context.categories.length > 0) {
      const categoryMatch = context.categories.some(
        cat => cat.toLowerCase() === product.category.toLowerCase()
      );
      if (categoryMatch) {
        score += 30;
        reasons.push(`perfect for ${product.category}`);
      }
    }

    // Keyword relevance (30 points)
    const text = `${product.title} ${product.description || ''}`.toLowerCase();
    const queryWords = query.toLowerCase().split(' ').filter(w => w.length > 2);
    let keywordMatches = 0;
    
    for (const word of queryWords) {
      if (text.includes(word)) {
        keywordMatches++;
      }
    }
    
    const keywordScore = Math.min(30, keywordMatches * 5);
    score += keywordScore;

    // Use case matching (20 points)
    if (context.useCase) {
      const useCaseScore = matchUseCase(product, context.useCase);
      score += useCaseScore;
      if (useCaseScore > 10) {
        reasons.push(`ideal for ${context.useCase} use`);
      }
    }

    // Preference matching (20 points)
    if (context.preferences && context.preferences.length > 0) {
      const prefScore = matchPreferences(product, context.preferences);
      score += prefScore;
      if (prefScore > 10) {
        const matchedPrefs = context.preferences.filter(pref =>
          text.includes(pref.toLowerCase())
        );
        if (matchedPrefs.length > 0) {
          reasons.push(`matches your preference for ${matchedPrefs[0]}`);
        }
      }
    }

    // Body type matching for clothing (bonus 15 points)
    if (context.bodyType && product.category === 'clothing') {
      const bodyTypeScore = matchBodyType(product, context.bodyType);
      score += bodyTypeScore;
      if (bodyTypeScore > 5) {
        reasons.push(getBodyTypeReason(context.bodyType));
      }
    }

    return { product, score, reasons };
  });

  // Sort by score (highest first)
  return scored.sort((a, b) => b.score - a.score);
}

/**
 * Match product to use case
 */
function matchUseCase(product: Product, useCase: string): number {
  const text = `${product.title} ${product.description || ''}`.toLowerCase();
  
  const useCaseMatches: { [key: string]: string[] } = {
    college: ['laptop', 'backpack', 'notebook', 'student', 'portable'],
    office: ['professional', 'business', 'laptop', 'bag', 'formal'],
    gaming: ['gaming', 'performance', 'fast', 'rgb', 'fps'],
    fitness: ['running', 'yoga', 'gym', 'fitness', 'athletic', 'sport'],
    travel: ['portable', 'lightweight', 'compact', 'travel', 'durable'],
    daily: ['everyday', 'casual', 'comfortable', 'practical'],
    gift: ['premium', 'elegant', 'special', 'quality'],
  };

  const keywords = useCaseMatches[useCase] || [];
  let matches = 0;
  
  for (const keyword of keywords) {
    if (text.includes(keyword)) {
      matches++;
    }
  }

  return Math.min(20, matches * 7);
}

/**
 * Match product to preferences
 */
function matchPreferences(product: Product, preferences: string[]): number {
  const text = `${product.title} ${product.description || ''}`.toLowerCase();
  let matches = 0;

  for (const pref of preferences) {
    if (text.includes(pref.toLowerCase())) {
      matches++;
    }
  }

  return Math.min(20, matches * 7);
}

/**
 * Match product to body type (for clothing)
 */
function matchBodyType(product: Product, bodyType: string): number {
  const text = `${product.title} ${product.description || ''}`.toLowerCase();

  const bodyTypeKeywords: { [key: string]: { positive: string[], negative: string[] } } = {
    'plus-size': {
      positive: ['comfortable', 'loose', 'relaxed', 'fit', 'stretch'],
      negative: ['slim-fit', 'tight', 'skinny'],
    },
    'slim': {
      positive: ['slim-fit', 'fitted', 'tailored', 'sleek'],
      negative: ['loose', 'baggy', 'oversized'],
    },
    'athletic': {
      positive: ['fitted', 'performance', 'athletic', 'sport'],
      negative: ['loose', 'baggy'],
    },
    'regular': {
      positive: ['regular-fit', 'standard', 'classic'],
      negative: [],
    },
  };

  const keywords = bodyTypeKeywords[bodyType];
  if (!keywords) return 0;

  let score = 5; // Base score

  for (const positive of keywords.positive) {
    if (text.includes(positive)) {
      score += 5;
    }
  }

  for (const negative of keywords.negative) {
    if (text.includes(negative)) {
      score -= 3;
    }
  }

  return Math.max(0, Math.min(15, score));
}

/**
 * Get explanation for body type recommendation
 */
function getBodyTypeReason(bodyType: string): string {
  const reasons: { [key: string]: string } = {
    'plus-size': 'comfortable fit that flatters your body type',
    'slim': 'tailored fit that complements your build',
    'athletic': 'performance fit designed for active lifestyles',
    'regular': 'classic fit that works for most body types',
  };
  return reasons[bodyType] || 'good fit for your body type';
}

/**
 * Get top N products with diversity
 * Ensures variety in categories when possible
 */
export function selectTopProducts(
  scoredProducts: ScoredProduct[],
  count: number
): ScoredProduct[] {
  const selected: ScoredProduct[] = [];
  const usedCategories = new Set<string>();

  // First pass: select highest scoring from different categories
  for (const item of scoredProducts) {
    if (selected.length >= count) break;
    
    if (!usedCategories.has(item.product.category)) {
      selected.push(item);
      usedCategories.add(item.product.category);
    }
  }

  // Second pass: fill remaining slots with highest scores
  for (const item of scoredProducts) {
    if (selected.length >= count) break;
    
    if (!selected.find(s => s.product.id === item.product.id)) {
      selected.push(item);
    }
  }

  return selected;
}
