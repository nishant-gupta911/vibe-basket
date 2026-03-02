import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getRevenueSummary() {
    const payments = await this.prisma.payment.aggregate({
      _sum: { amount: true },
      _count: { _all: true },
      where: { status: 'PAID' },
    });

    const refunds = await this.prisma.payment.aggregate({
      _sum: { refundedAmount: true },
      _count: { _all: true },
      where: { refundedAmount: { gt: 0 } },
    });

    const statusCounts = await this.prisma.payment.groupBy({
      by: ['status'],
      _count: { _all: true },
    });

    const revenueByDay = await this.prisma.$queryRaw<
      Array<{ day: string; total: number }>
    >`SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') as day, SUM(amount) as total
      FROM "Payment"
      WHERE status = 'PAID'
      GROUP BY 1
      ORDER BY 1`;

    const paidOrders = await this.prisma.order.findMany({
      where: { status: 'PAID' },
      select: { items: true },
    });

    const categoryTotals: Record<string, number> = {};
    for (const order of paidOrders) {
      const items = Array.isArray(order.items) ? (order.items as any[]) : [];
      for (const item of items) {
        const category = item.category || 'uncategorized';
        const amount = (item.price || 0) * (item.quantity || 0);
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      }
    }

    return {
      success: true,
      data: {
        totalRevenue: (payments._sum.amount || 0) / 100,
        totalPayments: payments._count._all,
        refundTotal: (refunds._sum.refundedAmount || 0) / 100,
        refundCount: refunds._count._all,
        revenueByDay: revenueByDay.map((entry) => ({
          day: entry.day,
          total: Number(entry.total || 0) / 100,
        })),
        revenueByCategory: Object.entries(categoryTotals).map(([category, total]) => ({
          category,
          total,
        })),
        statusBreakdown: statusCounts.map((entry) => ({
          status: entry.status,
          count: entry._count._all,
        })),
      },
      message: 'Revenue report generated',
    };
  }

  async getMarketplaceRevenue() {
    const commissions = await this.prisma.orderCommission.aggregate({
      _sum: { commissionAmount: true, vendorAmount: true },
      _count: { _all: true },
    });

    const payoutsPaid = await this.prisma.vendorPayout.aggregate({
      _sum: { amount: true },
      _count: { _all: true },
      where: { status: 'PAID' },
    });

    const payoutsPending = await this.prisma.vendorPayout.aggregate({
      _sum: { amount: true },
      _count: { _all: true },
      where: { status: 'PENDING' },
    });

    return {
      success: true,
      data: {
        totalPlatformRevenue: commissions._sum.commissionAmount || 0,
        totalVendorEarnings: commissions._sum.vendorAmount || 0,
        commissionCount: commissions._count._all,
        totalVendorPayouts: payoutsPaid._sum.amount || 0,
        pendingPayouts: payoutsPending._sum.amount || 0,
        payoutCount: payoutsPaid._count._all,
      },
      message: 'Marketplace revenue report',
    };
  }
}
