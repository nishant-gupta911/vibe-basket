import { Module } from '@nestjs/common';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { PrismaService } from '../../config/prisma.service';

@Module({
  controllers: [VendorsController],
  providers: [VendorsService, PrismaService],
  exports: [VendorsService],
})
export class VendorsModule {}
