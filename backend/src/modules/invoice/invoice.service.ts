import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import fs from 'fs';
import path from 'path';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async generateInvoice(orderId: string) {
    const existing = await this.prisma.invoice.findUnique({ where: { orderId } });
    if (existing) return existing;

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      return null;
    }

    const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${order.id.slice(0, 6)}`;
    const invoiceDir = path.join(process.cwd(), 'backend', 'invoices');
    if (!fs.existsSync(invoiceDir)) {
      fs.mkdirSync(invoiceDir, { recursive: true });
    }

    const filePath = path.join(invoiceDir, `${invoiceNumber}.pdf`);
    const lines = [
      `Invoice: ${invoiceNumber}`,
      `Order: ${order.id}`,
      `Customer: ${order.user?.name || 'N/A'} (${order.user?.email || 'N/A'})`,
      `Subtotal: ${order.subtotal.toFixed(2)}`,
      `Discount: ${order.discountAmount.toFixed(2)}`,
      `Tax: ${order.taxAmount.toFixed(2)}`,
      `Total: ${order.total.toFixed(2)}`,
      `Payment Ref: ${order.paymentReference || 'N/A'}`,
      `Status: ${order.status}`,
      `Date: ${order.createdAt.toISOString()}`,
    ];

    const pdfBuffer = this.buildSimplePdf(lines);
    fs.writeFileSync(filePath, pdfBuffer);

    return this.prisma.invoice.create({
      data: {
        orderId: order.id,
        invoiceNumber,
        filePath,
      },
    });
  }

  private buildSimplePdf(lines: string[]) {
    const escapedLines = lines.map((line) =>
      line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)'),
    );
    const content = escapedLines
      .map((line, index) => `1 0 0 1 50 ${750 - index * 16} Tm (${line}) Tj`)
      .join('\n');

    const stream = `BT\n/F1 12 Tf\n${content}\nET`;
    const objects: string[] = [];

    objects.push('1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj');
    objects.push('2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj');
    objects.push(
      '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj',
    );
    objects.push(`4 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`);
    objects.push('5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj');

    let offset = '%PDF-1.4\n'.length;
    const xrefOffsets = objects.map((obj) => {
      const current = offset;
      offset += obj.length + 1;
      return current;
    });

    const xref = ['xref', `0 ${objects.length + 1}`, '0000000000 65535 f ']
      .concat(xrefOffsets.map((off) => `${String(off).padStart(10, '0')} 00000 n `))
      .join('\n');
    const trailer = `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${offset}\n%%EOF`;

    return Buffer.from(['%PDF-1.4', ...objects, xref, trailer].join('\n'));
  }
}
