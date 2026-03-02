import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(userId: string) {
    const items = await this.prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: items.map((item) => item.product),
      message: 'Wishlist retrieved',
    };
  }

  async addToWishlist(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.wishlist.upsert({
      where: { userId_productId: { userId, productId } },
      update: {},
      create: { userId, productId },
    });

    return {
      success: true,
      data: { productId },
      message: 'Added to wishlist',
    };
  }

  async removeFromWishlist(userId: string, productId: string) {
    await this.prisma.wishlist.deleteMany({
      where: { userId, productId },
    });

    return {
      success: true,
      data: { productId },
      message: 'Removed from wishlist',
    };
  }
}
