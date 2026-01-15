import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { PrismaService } from '../../config/prisma.service';

@Module({
  controllers: [AIController],
  providers: [PrismaService],
  exports: [],
})
export class AIModule {}
