import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from '../../config/prisma.service';
import { CacheService } from '../../common/cache/cache.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, CacheService],
})
export class ProductModule {}
