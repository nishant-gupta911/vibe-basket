import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { PrismaService } from '../../config/prisma.service';
import { PersonalizationModule } from '../personalization/personalization.module';

@Module({
  imports: [PersonalizationModule],
  controllers: [AIController],
  providers: [PrismaService],
  exports: [],
})
export class AIModule {}
