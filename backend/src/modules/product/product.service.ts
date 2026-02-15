import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { QueryProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getProducts(query: QueryProductDto) {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      tags,
      inStock = true,
      page = 1,
      limit = 20,
    } = query;
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 20;
    const skip = (safePage - 1) * safeLimit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      const categories = category
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
      if (categories.length > 1) {
        where.category = { in: categories };
      } else if (categories.length === 1) {
        where.category = categories[0];
      }
    }

    if (typeof inStock === 'boolean') {
      where.inStock = inStock;
    }

    if (typeof minPrice === 'number' || typeof maxPrice === 'number') {
      where.price = {};
      if (typeof minPrice === 'number') where.price.gte = minPrice;
      if (typeof maxPrice === 'number') where.price.lte = maxPrice;
    }

    if (tags) {
      const tagList = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
      if (tagList.length > 0) {
        where.tags = { hasSome: tagList };
      }
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: safePage,
          limit: safeLimit,
          pages: Math.ceil(total / safeLimit) || 1,
          totalPages: Math.ceil(total / safeLimit) || 1,
        },
      },
      message: 'Products retrieved',
    };
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      success: true,
      data: product,
      message: 'Product retrieved',
    };
  }

  async getCategories() {
    const grouped = await this.prisma.product.groupBy({
      by: ['category'],
      _count: { _all: true },
    });

    return {
      success: true,
      data: grouped.map((c) => ({
        name: c.category,
        count: c._count._all,
      })),
      message: 'Categories retrieved',
    };
  }
}
