import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private analyticsService: AnalyticsService,
    private notificationsService: NotificationsService,
  ) {}

  async createOrder(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Calculate total and get product details
    let total = 0;
    const orderItems = [];
    const productIds = cart.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    const productMap = new Map(products.map((product) => [product.id, product]));

    for (const item of cart.items) {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      if (!product.inStock) {
        throw new BadRequestException(`Product ${product.title} is out of stock`);
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      orderItems.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        subtotal: itemTotal,
      });
    }

    // Create order
    const order = await this.prisma.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        items: orderItems,
      },
    });

    await this.analyticsService.trackEvent(userId, null, 'purchase', {
      orderId: order.id,
      total,
      items: orderItems.map((item) => ({ productId: item.productId, quantity: item.quantity })),
    });

    await this.notificationsService.createNotification(
      userId,
      null,
      'order_confirmation',
      `Order ${order.id} confirmed`,
      { orderId: order.id, total },
    );

    // Clear cart
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return {
      success: true,
      data: order,
      message: 'Order created successfully',
    };
  }

  async getOrders(userId: string, status?: string) {
    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const orders = await this.prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: orders,
      message: 'Orders retrieved',
    };
  }

  async getOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      success: true,
      data: order,
      message: 'Order retrieved',
    };
  }
}
