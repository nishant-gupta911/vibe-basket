import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

@Controller('recommendations')
export class RecommendationController {
  constructor(private recommendationService: RecommendationService) {}

  @Get('related/:productId')
  async related(@Param('productId') productId: string, @Query('limit') limit?: string) {
    const parsedLimit = limit ? Math.min(Math.max(Number(limit) || 6, 1), 20) : 6;
    const products = await this.recommendationService.getRelatedProducts(productId, parsedLimit);
    return { success: true, data: { products }, message: 'Related products' };
  }

  @Get('trending')
  async trending(@Query('limit') limit?: string) {
    const parsedLimit = limit ? Math.min(Math.max(Number(limit) || 6, 1), 20) : 6;
    const products = await this.recommendationService.getTrendingProducts(parsedLimit);
    return { success: true, data: { products }, message: 'Trending products' };
  }

  @Get('frequently-bought/:productId')
  async frequentlyBought(@Param('productId') productId: string, @Query('limit') limit?: string) {
    const parsedLimit = limit ? Math.min(Math.max(Number(limit) || 4, 1), 20) : 4;
    const products = await this.recommendationService.getFrequentlyBoughtTogether(productId, parsedLimit);
    return { success: true, data: { products }, message: 'Frequently bought together' };
  }

  @Get('recently-viewed')
  async recentlyViewed(@Request() req, @Query('limit') limit?: string) {
    const parsedLimit = limit ? Math.min(Math.max(Number(limit) || 6, 1), 20) : 6;
    const products = await this.recommendationService.getRecentlyViewed(
      req.user?.userId || null,
      req.sessionId || null,
      parsedLimit,
    );
    return { success: true, data: { products }, message: 'Recently viewed' };
  }
}
