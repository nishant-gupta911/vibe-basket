import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async validateCoupon(code: string, userId: string, subtotal: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
      include: { _count: { select: { redemptions: true } } },
    });

    if (!coupon || !coupon.isActive) {
      throw new BadRequestException('Invalid coupon');
    }

    if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Coupon expired');
    }

    if (coupon.usageLimit && coupon._count.redemptions >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    if (coupon.perUserLimit) {
      const usedByUser = await this.prisma.couponRedemption.count({
        where: { couponId: coupon.id, userId },
      });
      if (usedByUser >= coupon.perUserLimit) {
        throw new BadRequestException('Coupon usage limit reached');
      }
    }

    let discountAmount = 0;
    if (coupon.type === 'PERCENT') {
      discountAmount = Math.min(subtotal, (subtotal * coupon.amount) / 100);
    } else {
      discountAmount = Math.min(subtotal, coupon.amount);
    }

    return {
      coupon,
      discountAmount,
    };
  }

  async createCoupon(dto: {
    code: string;
    type: 'PERCENT' | 'FIXED';
    amount: number;
    expiresAt?: string;
    usageLimit?: number;
    perUserLimit?: number;
    isActive?: boolean;
  }) {
    const coupon = await this.prisma.coupon.create({
      data: {
        code: dto.code.toUpperCase(),
        type: dto.type,
        amount: dto.amount,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        usageLimit: dto.usageLimit,
        perUserLimit: dto.perUserLimit,
        isActive: dto.isActive ?? true,
      },
    });

    return {
      success: true,
      data: coupon,
      message: 'Coupon created',
    };
  }

  async listCoupons() {
    const coupons = await this.prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: coupons,
      message: 'Coupons retrieved',
    };
  }
}
