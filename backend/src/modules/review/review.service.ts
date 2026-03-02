import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async getReviews(productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: reviews,
      message: 'Reviews retrieved',
    };
  }

  async addReview(userId: string, productId: string, dto: CreateReviewDto) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.prisma.review.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      throw new ConflictException('You have already reviewed this product');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.review.create({
        data: {
          userId,
          productId,
          rating: dto.rating,
          comment: dto.comment,
        },
      });

      const aggregate = await tx.review.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          rating: aggregate._avg.rating || 0,
          reviewCount: aggregate._count.rating || 0,
        },
      });
    });

    return {
      success: true,
      data: { productId },
      message: 'Review submitted',
    };
  }
}
