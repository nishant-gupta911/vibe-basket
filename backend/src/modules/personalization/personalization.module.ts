import { Module } from '@nestjs/common';
import { PersonalizationController } from './personalization.controller';
import { PersonalizationService } from './personalization.service';
import { PrismaService } from '../../config/prisma.service';

@Module({
  controllers: [PersonalizationController],
  providers: [PersonalizationService, PrismaService],
  exports: [PersonalizationService],
})
export class PersonalizationModule {}
