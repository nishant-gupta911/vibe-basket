import { Controller, Get, Query, Request } from '@nestjs/common';
import { PersonalizationService } from './personalization.service';

@Controller('personalization')
export class PersonalizationController {
  constructor(private personalizationService: PersonalizationService) {}

  @Get('recommendations')
  async getRecommendations(
    @Request() req,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
  ) {
    const parsedLimit = limit ? Math.min(Math.max(Number(limit) || 12, 1), 50) : 12;
    const products = await this.personalizationService.getPersonalizedProducts(
      req.user?.userId || null,
      req.sessionId || null,
      parsedLimit,
      category,
    );

    return {
      success: true,
      data: { products },
      message: 'Personalized recommendations',
    };
  }
}
