import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

interface CategoryWeights {
  [category: string]: number;
}

@Injectable()
export class PersonalizationService {
  constructor(private prisma: PrismaService) {}

  async getCategoryWeights(userId?: string | null, sessionId?: string | null): Promise<CategoryWeights> {
    const events = await this.prisma.analyticsEvent.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(sessionId ? { sessionId } : {}),
        event: { in: ['product_view', 'cart_add', 'purchase'] },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    if (events.length === 0) return {};

    const productIds = events
      .flatMap((event) => {
        const meta = event.meta as any;
        if (event.event === 'purchase' && Array.isArray(meta?.items)) {
          return meta.items.map((item: any) => item.productId).filter(Boolean);
        }
        return meta?.productId ? [meta.productId] : [];
      })
      .filter(Boolean);

    if (productIds.length === 0) return {};

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, category: true },
    });

    const categoryWeights: CategoryWeights = {};

    for (const event of events) {
      const meta = event.meta as any;
      const weight = event.event === 'purchase' ? 5 : event.event === 'cart_add' ? 3 : 1;

      if (event.event === 'purchase' && Array.isArray(meta?.items)) {
        for (const item of meta.items) {
          const product = products.find((p) => p.id === item.productId);
          if (product) {
            categoryWeights[product.category] = (categoryWeights[product.category] || 0) + weight;
          }
        }
        continue;
      }

      if (meta?.productId) {
        const product = products.find((p) => p.id === meta.productId);
        if (product) {
          categoryWeights[product.category] = (categoryWeights[product.category] || 0) + weight;
        }
      }
    }

    return categoryWeights;
  }

  async getPersonalizedProducts(
    userId?: string | null,
    sessionId?: string | null,
    limit: number = 12,
    category?: string,
  ) {
    const weights = await this.getCategoryWeights(userId, sessionId);
    const categories = Object.keys(weights).sort((a, b) => weights[b] - weights[a]);

    const products = await this.prisma.product.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(categories.length > 0 && !category ? { category: { in: categories } } : {}),
      },
      take: 50,
      orderBy: { createdAt: 'desc' },
    });

    const scored = products.map((product) => {
      const categoryBoost = weights[product.category] || 0;
      const score = categoryBoost * 10 + product.rating * 2 + product.popularity * 0.1;
      return { product, score };
    });

    const sorted = scored.sort((a, b) => b.score - a.score).map((item) => item.product);

    if (sorted.length >= limit) return sorted.slice(0, limit);

    if (sorted.length < limit) {
      const fallback = await this.prisma.product.findMany({
        where: category ? { category } : {},
        take: limit - sorted.length,
        orderBy: { createdAt: 'desc' },
      });
      return [...sorted, ...fallback.filter((p) => !sorted.find((s) => s.id === p.id))].slice(0, limit);
    }

    return sorted;
  }
}
