import { Module } from '@nestjs/common';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { PrismaService } from '../../config/prisma.service';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ProductModule],
  controllers: [VendorsController],
  providers: [VendorsService, PrismaService],
  exports: [VendorsService],
})
export class VendorsModule {}
