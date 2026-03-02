import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CacheService } from '../../common/cache/cache.service';

@Injectable()
export class RecommendationService {
  constructor(private prisma: PrismaService, private cache: CacheService) {}

  async getRelatedProducts(productId: string, limit: number = 6) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { category: true, tags: true },
    });

    if (!product) return [];

    const related = await this.prisma.product.findMany({
      where: {
        id: { not: productId },
        inStock: true,
        OR: [
          { category: product.category },
          { tags: { hasSome: product.tags || [] } },
        ],
      },
      take: limit * 2,
      orderBy: [{ popularity: 'desc' }, { rating: 'desc' }],
    });

    return related.slice(0, limit);
  }

  async getTrendingProducts(limit: number = 6) {
    const cacheKey = `trending:${limit}`;
    const cached = this.cache.get<any[]>(cacheKey);
    if (cached) return cached;
    const products = await this.prisma.product.findMany({
      where: { inStock: true },
      orderBy: [{ popularity: 'desc' }, { rating: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    });
    this.cache.set(cacheKey, products, 60_000);
    return products;
  }

  async getFrequentlyBoughtTogether(productId: string, limit: number = 4) {
    const orders = await this.prisma.order.findMany({
      where: {
        items: {
          path: ['productId'],
          array_contains: productId,
        } as any,
      },
      select: { items: true },
      take: 50,
    });

    const frequency: Record<string, number> = {};

    for (const order of orders) {
      const items = order.items as Array<{ productId: string }>;
      for (const item of items) {
        if (item.productId === productId) continue;
        frequency[item.productId] = (frequency[item.productId] || 0) + 1;
      }
    }

    const sortedIds = Object.keys(frequency).sort((a, b) => frequency[b] - frequency[a]).slice(0, limit);

    if (sortedIds.length === 0) return [];

    const products = await this.prisma.product.findMany({
      where: { id: { in: sortedIds } },
    });

    return sortedIds.map((id) => products.find((p) => p.id === id)).filter(Boolean);
  }

  async getRecentlyViewed(userId?: string | null, sessionId?: string | null, limit: number = 6) {
    const events = await this.prisma.analyticsEvent.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(sessionId ? { sessionId } : {}),
        event: 'product_view',
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const productIds = Array.from(new Set(events.map((event) => (event.meta as any)?.productId).filter(Boolean)));

    if (productIds.length === 0) return [];

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    return productIds.map((id) => products.find((p) => p.id === id)).filter(Boolean).slice(0, limit);
  }
}
