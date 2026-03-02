import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class TaxService {
  constructor(private prisma: PrismaService) {}

  async calculateTax(region: string | undefined, amount: number) {
    if (!region) {
      return { taxAmount: 0, taxRate: 0, region: undefined };
    }

    const rate = await this.prisma.taxRate.findFirst({
      where: { region: region.toLowerCase(), isActive: true },
    });

    if (!rate) {
      return { taxAmount: 0, taxRate: 0, region: region.toLowerCase() };
    }

    const rawTax = (amount * rate.rate) / 100;
    const taxAmount = Math.round(rawTax * 100) / 100;

    return { taxAmount, taxRate: rate.rate, region: rate.region };
  }

  async createRate(dto: { region: string; rate: number; isActive?: boolean }) {
    const taxRate = await this.prisma.taxRate.create({
      data: {
        region: dto.region.toLowerCase(),
        rate: dto.rate,
        isActive: dto.isActive ?? true,
      },
    });

    return {
      success: true,
      data: taxRate,
      message: 'Tax rate created',
    };
  }

  async listRates() {
    const rates = await this.prisma.taxRate.findMany({ orderBy: { region: 'asc' } });
    return { success: true, data: rates, message: 'Tax rates retrieved' };
  }
}
