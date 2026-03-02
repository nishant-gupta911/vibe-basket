import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { RecommendationService } from '../recommendation/recommendation.service';
import { CacheService } from '../../common/cache/cache.service';
import { logger } from '../../common/utils/logger';

type JobInterval = NodeJS.Timeout;

@Injectable()
export class JobsService implements OnModuleInit, OnModuleDestroy {
  private behaviorInterval: JobInterval | null = null;
  private recommendationInterval: JobInterval | null = null;
  private trendingInterval: JobInterval | null = null;
  private lastBehaviorAggregationAt: Date | null = null;

  constructor(
    private prisma: PrismaService,
    private recommendations: RecommendationService,
    private cache: CacheService,
  ) {}

  onModuleInit() {
    this.runBehaviorAggregation().catch((error) =>
      logger.log('error', 'Behavior aggregation failed', { error: String(error) }),
    );
    this.runRecommendationWarmup().catch((error) =>
      logger.log('error', 'Recommendation warmup failed', { error: String(error) }),
    );
    this.runTrendingWarmup().catch((error) =>
      logger.log('error', 'Trending warmup failed', { error: String(error) }),
    );

    this.behaviorInterval = setInterval(() => {
      this.runBehaviorAggregation().catch((error) =>
        logger.log('error', 'Behavior aggregation failed', { error: String(error) }),
      );
    }, 5 * 60_000);

    this.recommendationInterval = setInterval(() => {
      this.runRecommendationWarmup().catch((error) =>
        logger.log('error', 'Recommendation warmup failed', { error: String(error) }),
      );
    }, 10 * 60_000);

    this.trendingInterval = setInterval(() => {
      this.runTrendingWarmup().catch((error) =>
        logger.log('error', 'Trending warmup failed', { error: String(error) }),
      );
    }, 2 * 60_000);
  }

  onModuleDestroy() {
    if (this.behaviorInterval) clearInterval(this.behaviorInterval);
    if (this.recommendationInterval) clearInterval(this.recommendationInterval);
    if (this.trendingInterval) clearInterval(this.trendingInterval);
  }

  private async runBehaviorAggregation() {
    const now = new Date();
    const since = this.lastBehaviorAggregationAt ?? new Date(Date.now() - 24 * 60 * 60_000);
    this.lastBehaviorAggregationAt = now;

    const events = await this.prisma.analyticsEvent.findMany({
      where: {
        createdAt: { gte: since },
        event: { in: ['product_view', 'cart_add', 'purchase'] },
      },
      select: { event: true, meta: true },
    });

    const weights: Record<string, number> = {
      product_view: 1,
      cart_add: 3,
      purchase: 5,
    };

    const scores = new Map<string, number>();

    for (const event of events) {
      const productId = (event.meta as any)?.productId as string | undefined;
      if (!productId) continue;
      const score = weights[event.event] ?? 0;
      scores.set(productId, (scores.get(productId) ?? 0) + score);
    }

    if (scores.size === 0) return;

    const updates = Array.from(scores.entries()).map(([productId, score]) =>
      this.prisma.product.update({
        where: { id: productId },
        data: { popularity: score },
      }),
    );

    await this.prisma.$transaction(updates);
    this.cache.deleteByPrefix('products:');
    this.cache.deleteByPrefix('trending:');
    logger.log('info', 'Behavior aggregation completed', { productsUpdated: scores.size });
  }

  private async runRecommendationWarmup() {
    const topProducts = await this.prisma.product.findMany({
      where: { inStock: true },
      orderBy: [{ popularity: 'desc' }, { rating: 'desc' }],
      take: 20,
      select: { id: true },
    });

    for (const product of topProducts) {
      await this.recommendations.getRelatedProducts(product.id, 6);
      await this.recommendations.getFrequentlyBoughtTogether(product.id, 4);
    }

    logger.log('info', 'Recommendation warmup completed', { products: topProducts.length });
  }

  private async runTrendingWarmup() {
    await this.recommendations.getTrendingProducts(6);
    logger.log('info', 'Trending cache warmed');
  }
}
