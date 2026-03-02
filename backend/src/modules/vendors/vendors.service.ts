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
}
