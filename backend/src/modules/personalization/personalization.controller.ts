import { Controller, Get, Query, Request } from '@nestjs/common';
import { PersonalizationService } from './personalization.service';
import { CacheService } from '../../common/cache/cache.service';

@Controller('personalization')
export class PersonalizationController {
  constructor(private personalizationService: PersonalizationService, private cache: CacheService) {}

  @Get('recommendations')
  async getRecommendations(
    @Request() req,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
  ) {
    const parsedLimit = limit ? Math.min(Math.max(Number(limit) || 12, 1), 50) : 12;
    const cacheKey = `personalized:${req.user?.userId || 'guest'}:${req.sessionId || 'none'}:${parsedLimit}:${category || ''}`;
    const cached = this.cache.get<any>(cacheKey);
    if (cached) return cached;

    const products = await this.personalizationService.getPersonalizedProducts(
      req.user?.userId || null,
      req.sessionId || null,
      parsedLimit,
      category,
    );
    const response = {
      success: true,
      data: { products },
      message: 'Personalized recommendations',
    };
    this.cache.set(cacheKey, response, 30_000);
    return response;
  }
}
