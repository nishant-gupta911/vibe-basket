import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  async getVendorByUserId(userId: string) {
    return this.prisma.vendor.findUnique({ where: { userId } });
  }

  async applyVendor(userId: string, verified?: boolean) {
    const existing = await this.prisma.vendor.findUnique({ where: { userId } });
    if (existing) {
      return { success: true, data: existing, message: 'Vendor already exists' };
    }

    const vendor = await this.prisma.vendor.create({
      data: {
        userId,
        status: 'PENDING',
        commissionRate: 10,
        payoutBalance: 0,
        verified: verified ?? false,
      },
    });

    return { success: true, data: vendor, message: 'Vendor application submitted' };
  }

  async createPayout(vendorId: string, amount: number) {
    const vendor = await this.prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    if (amount > vendor.payoutBalance) {
      throw new BadRequestException('Insufficient payout balance');
    }

    const payout = await this.prisma.vendorPayout.create({
      data: {
        vendorId,
        amount,
        status: 'PENDING',
      },
    });

    return { success: true, data: payout, message: 'Payout created' };
  }

  async approvePayout(payoutId: string) {
    const payout = await this.prisma.vendorPayout.findUnique({ where: { id: payoutId } });
    if (!payout) {
      throw new NotFoundException('Payout not found');
    }

    if (payout.status === 'PAID') {
      return { success: true, data: payout, message: 'Payout already paid' };
    }

    await this.prisma.$transaction([
      this.prisma.vendorPayout.update({
        where: { id: payoutId },
        data: { status: 'PAID', paidAt: new Date() },
      }),
      this.prisma.vendor.update({
        where: { id: payout.vendorId },
        data: { payoutBalance: { decrement: payout.amount } },
      }),
    ]);

    const updated = await this.prisma.vendorPayout.findUnique({ where: { id: payoutId } });
    return { success: true, data: updated, message: 'Payout approved' };
  }

  async listPayouts(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    const payouts = await this.prisma.vendorPayout.findMany({
      where: { vendorId: vendor.id },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: payouts, message: 'Payouts retrieved' };
  }

  async getDashboard(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const commissions = await this.prisma.orderCommission.aggregate({
      _sum: { vendorAmount: true, commissionAmount: true },
      _count: { _all: true },
      where: { vendorId: vendor.id },
    });

    return {
      success: true,
      data: {
        payoutBalance: vendor.payoutBalance,
        totalEarnings: commissions._sum.vendorAmount || 0,
        totalCommission: commissions._sum.commissionAmount || 0,
        totalOrders: commissions._count._all,
      },
      message: 'Vendor dashboard',
    };
  }

  async getVendorOrders(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const commissions = await this.prisma.orderCommission.findMany({
      where: { vendorId: vendor.id },
      select: { orderId: true },
    });

    const orderIds = Array.from(new Set(commissions.map((c) => c.orderId)));
    if (orderIds.length === 0) {
      return { success: true, data: [], message: 'Vendor orders' };
    }

    const orders = await this.prisma.order.findMany({
      where: { id: { in: orderIds } },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: orders, message: 'Vendor orders' };
  }

  async getProductPerformance(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const orders = await this.prisma.orderCommission.findMany({
      where: { vendorId: vendor.id },
      select: { orderId: true },
    });
    const orderIds = Array.from(new Set(orders.map((o) => o.orderId)));
    if (orderIds.length === 0) {
      return { success: true, data: [], message: 'Product performance' };
    }

    const orderRecords = await this.prisma.order.findMany({
      where: { id: { in: orderIds } },
      select: { items: true },
    });

    const performance: Record<string, { productId: string; title: string; revenue: number; units: number }> = {};
    for (const order of orderRecords) {
      const items = Array.isArray(order.items) ? (order.items as any[]) : [];
      for (const item of items) {
        if (item.vendorId !== vendor.id) continue;
        const key = item.productId;
        if (!performance[key]) {
          performance[key] = { productId: item.productId, title: item.title, revenue: 0, units: 0 };
        }
        performance[key].units += item.quantity || 0;
        performance[key].revenue += (item.price || 0) * (item.quantity || 0);
      }
    }

    return {
      success: true,
      data: Object.values(performance).sort((a, b) => b.revenue - a.revenue),
      message: 'Product performance',
    };
  }
}
