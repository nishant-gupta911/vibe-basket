import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { PrismaService } from '../../config/prisma.service';
import { RecommendationModule } from '../recommendation/recommendation.module';

@Module({
  imports: [RecommendationModule],
  providers: [JobsService, PrismaService],
})
export class JobsModule {}
