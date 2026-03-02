import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CacheService } from '../../common/cache/cache.service';
import { QueryProductDto, CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService, private cache: CacheService) {}
  private categoriesCache = new Map<string, { data: Array<{ name: string; count: number }>; expiresAt: number }>();

  async getProducts(query: QueryProductDto, user?: { userId: string; role?: string } | null) {
    const cacheKey = `products:${JSON.stringify(query)}:${user?.role || 'guest'}:${user?.userId || 'none'}`;
    const cached = this.cache.get<any>(cacheKey);
    if (cached) return cached;

    const {
      search,
      category,
      minPrice,
      maxPrice,
      tags,
      minRating,
      sortBy,
      inStock,
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

    if (user?.role === 'vendor') {
      const vendor = await this.prisma.vendor.findUnique({
        where: { userId: user.userId },
        select: { id: true },
      });
      if (vendor) {
        where.vendorId = vendor.id;
      }
    } else if (user?.role !== 'admin') {
      where.vendor = { status: 'APPROVED' };
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

    if (typeof minRating === 'number') {
      where.rating = { gte: minRating };
    }

    const orderBy = (() => {
      switch (sortBy) {
        case 'price-asc':
          return { price: 'asc' as const };
        case 'price-desc':
          return { price: 'desc' as const };
        case 'popularity':
          return { popularity: 'desc' as const };
        case 'rating':
          return { rating: 'desc' as const };
        case 'newest':
        default:
          return { createdAt: 'desc' as const };
      }
    })();

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy,
      }),
      this.prisma.product.count({ where }),
    ]);

    const response = {
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
    this.cache.set(cacheKey, response, 60_000);
    return response;
  }

  async getProduct(id: string, user?: { userId: string; role?: string } | null) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (user?.role === 'vendor') {
      const vendor = await this.prisma.vendor.findUnique({
        where: { userId: user.userId },
        select: { id: true },
      });
      if (!vendor || product.vendorId !== vendor.id) {
        throw new NotFoundException('Product not found');
      }
    } else if (user?.role !== 'admin') {
      const vendor = await this.prisma.vendor.findUnique({
        where: { id: product.vendorId },
        select: { status: true },
      });
      if (!vendor || vendor.status !== 'APPROVED') {
        throw new NotFoundException('Product not found');
      }
    }

    return {
      success: true,
      data: product,
      message: 'Product retrieved',
    };
  }

  async getCategories(user?: { userId: string; role?: string } | null) {
    const now = Date.now();
    const cacheKey = `${user?.role || 'guest'}:${user?.userId || 'none'}`;
    const cached = this.categoriesCache.get(cacheKey);
    if (cached && cached.expiresAt > now) {
      return {
        success: true,
        data: cached.data,
        message: 'Categories retrieved',
      };
    }

    const where: any = {};
    if (user?.role === 'vendor') {
      const vendor = await this.prisma.vendor.findUnique({
        where: { userId: user.userId },
        select: { id: true },
      });
      if (vendor) {
        where.vendorId = vendor.id;
      }
    } else if (user?.role !== 'admin') {
      where.vendor = { status: 'APPROVED' };
    }

    const grouped = await this.prisma.product.groupBy({
      where,
      by: ['category'],
      _count: { _all: true },
    });

    const data = grouped.map((c) => ({
      name: c.category,
      count: c._count._all,
    }));

    this.categoriesCache.set(cacheKey, { data, expiresAt: now + 60_000 });

    return {
      success: true,
      data,
      message: 'Categories retrieved',
    };
  }

  async createProduct(dto: CreateProductDto) {
    if (!dto.vendorId) {
      throw new NotFoundException('Vendor not specified');
    }
    const product = await this.prisma.product.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        price: dto.price,
        image: dto.image,
        inStock: dto.inStock ?? true,
        stock: dto.stock ?? 0,
        tags: dto.tags ?? [],
        vendorId: dto.vendorId,
      },
    });

    return {
      success: true,
      data: product,
      message: 'Product created',
    };
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        price: dto.price,
        image: dto.image,
        inStock: dto.inStock,
        stock: dto.stock,
        tags: dto.tags,
        vendorId: dto.vendorId,
      },
    });

    return {
      success: true,
      data: product,
      message: 'Product updated',
    };
  }

  async deleteProduct(id: string) {
    await this.prisma.product.delete({ where: { id } });

    return {
      success: true,
      data: { id },
      message: 'Product deleted',
    };
  }

  async updateProductForVendor(userId: string, id: string, dto: UpdateProductDto) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const product = await this.prisma.product.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        price: dto.price,
        image: dto.image,
        inStock: dto.inStock,
        stock: dto.stock,
        tags: dto.tags,
      },
    });

    return { success: true, data: updated, message: 'Product updated' };
  }
}
