import { Module } from '@nestjs/common';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { PrismaService } from '../../config/prisma.service';
import { CacheService } from '../../common/cache/cache.service';

@Module({
  controllers: [RecommendationController],
  providers: [RecommendationService, PrismaService, CacheService],
  exports: [RecommendationService],
})
export class RecommendationModule {}
