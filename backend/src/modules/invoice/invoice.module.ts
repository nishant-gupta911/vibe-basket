import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { PrismaService } from '../../config/prisma.service';

@Module({
  providers: [InvoiceService, PrismaService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
