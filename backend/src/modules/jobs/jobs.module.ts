import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { PrismaService } from '../../config/prisma.service';
import { RecommendationModule } from '../recommendation/recommendation.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [RecommendationModule, NotificationsModule],
  providers: [JobsService, PrismaService],
})
export class JobsModule {}
