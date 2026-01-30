/**
 * UNIT TESTS: Product Filtering and Ranking
 * Tests the product filtering and ranking logic
 */

import { filterProducts, rankProducts, Product } from '../../backend/src/modules/ai/product-ranker';
import { UserContext } from '../../backend/src/modules/ai/intent-classifier';

// Mock products for testing
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Premium Leather Wallet',
    description: 'Quality leather wallet',
    category: 'accessories',
    price: 49.99,
    image: 'wallet.jpg',
    inStock: true,
  },
  {
    id: '2',
    title: 'Running Shoes',
    description: 'Athletic running shoes',
    category: 'footwear',
    price: 129.99,
    image: 'shoes.jpg',
    inStock: true,
  },
  {
    id: '3',
    title: 'Budget T-Shirt',
    description: 'Affordable casual tee',
    category: 'clothing',
    price: 19.99,
    image: 'tshirt.jpg',
    inStock: true,
  },
  {
    id: '4',
    title: 'Gaming Laptop',
    description: 'High-performance gaming laptop',
    category: 'laptops',
    price: 1799.99,
    image: 'laptop.jpg',
    inStock: true,
  },
  {
    id: '5',
    title: 'Out of Stock Item',
    description: 'Unavailable product',
    category: 'clothing',
    price: 29.99,
    image: 'item.jpg',
    inStock: false,
  },
];

describe('Product Filtering', () => {
  test('should filter out out-of-stock products', () => {
    const filtered = filterProducts(mockProducts, {});

    expect(filtered.length).toBe(4); // Excludes out-of-stock item
    expect(filtered.every(p => p.inStock)).toBe(true);
  });

  test('should filter products within budget', () => {
    const context: UserContext = {
      budget: { min: 0, max: 100 },
    };

    const filtered = filterProducts(mockProducts, context);

    expect(filtered.every(p => p.price <= 100)).toBe(true);
    expect(filtered).toContainEqual(expect.objectContaining({ id: '1' })); // Wallet
    expect(filtered).toContainEqual(expect.objectContaining({ id: '3' })); // T-Shirt
  });

  test('should filter products by budget range', () => {
    const context: UserContext = {
      budget: { min: 50, max: 150 },
    };

    const filtered = filterProducts(mockProducts, context);

    expect(filtered.every(p => p.price >= 50 && p.price <= 150)).toBe(true);
    expect(filtered).toContainEqual(expect.objectContaining({ id: '2' })); // Running shoes
  });

  test('should filter products by category', () => {
    const context: UserContext = {
      categories: ['clothing'],
    };

    const filtered = filterProducts(mockProducts, context);

    expect(filtered.every(p => p.category === 'clothing')).toBe(true);
    expect(filtered.length).toBe(1); // Only in-stock clothing
  });

  test('should filter by both budget and category', () => {
    const context: UserContext = {
      budget: { min: 0, max: 50 },
      categories: ['accessories'],
    };

    const filtered = filterProducts(mockProducts, context);

    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('1'); // Premium wallet
  });
});

describe('Product Ranking', () => {
  test('should rank products by relevance', () => {
    const context: UserContext = {
      budget: { min: 0, max: 100 },
    };

    const ranked = rankProducts(mockProducts.filter(p => p.inStock), context, 'leather wallet');

    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThan(0);
    // Products should be sorted by score
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i-1].score).toBeGreaterThanOrEqual(ranked[i].score);
    }
  });

  test('should prioritize products within budget', () => {
    const context: UserContext = {
      budget: { min: 0, max: 100 },
    };

    const ranked = rankProducts(mockProducts.filter(p => p.inStock), context, 'product');

    const withinBudget = ranked.filter(r => r.product.price <= 100);
    const overBudget = ranked.filter(r => r.product.price > 100);

    if (withinBudget.length > 0 && overBudget.length > 0) {
      expect(withinBudget[0].score).toBeGreaterThan(overBudget[0].score);
    }
  });

  test('should boost category matches', () => {
    const context: UserContext = {
      categories: ['laptops'],
    };

    const ranked = rankProducts(mockProducts.filter(p => p.inStock), context, 'laptop');

    // Laptop should rank higher than other products
    const laptopRanking = ranked.find(r => r.product.category === 'laptops');
    expect(laptopRanking).toBeDefined();
    expect(laptopRanking!.reasons.length).toBeGreaterThan(0);
  });

  test('should include reasoning for scores', () => {
    const context: UserContext = {
      budget: { min: 0, max: 50 },
    };

    const ranked = rankProducts(mockProducts.filter(p => p.inStock), context, 'shirt');

    const tshirt = ranked.find(r => r.product.id === '3');
    expect(tshirt).toBeDefined();
    expect(tshirt!.reasons.length).toBeGreaterThan(0);
  });
});
