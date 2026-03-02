import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService, private analyticsService: AnalyticsService) {}

  async getCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    // Fetch product details for each cart item
    const itemsWithProducts = await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });
        return {
          ...item,
          product,
        };
      }),
    );

    return {
      success: true,
      data: {
        ...cart,
        items: itemsWithProducts,
      },
      message: 'Cart retrieved',
    };
  }

  async addToCart(userId: string, dto: AddToCartDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.inStock || product.stock <= 0) {
      throw new BadRequestException('Product out of stock');
    }

    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: dto.productId,
      },
    });

    const requestedQuantity = existingItem ? existingItem.quantity + dto.quantity : dto.quantity;
    if (requestedQuantity > product.stock) {
      throw new BadRequestException(`Only ${product.stock} item(s) available`);
    }

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: requestedQuantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          quantity: dto.quantity,
        },
      });
    }

    await this.analyticsService.trackEvent(userId, null, 'cart_add', {
      productId: dto.productId,
      quantity: dto.quantity,
    });

    return this.getCart(userId);
  }

  async updateCartItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (dto.quantity === 0) {
      await this.prisma.cartItem.delete({
        where: { id: cartItem.id },
      });
    } else {
      const product = await this.prisma.product.findUnique({
        where: { id: cartItem.productId },
      });

      if (!product || !product.inStock || product.stock <= 0) {
        throw new BadRequestException('Product is unavailable');
      }

      if (dto.quantity > product.stock) {
        throw new BadRequestException(`Only ${product.stock} item(s) available`);
      }

      await this.prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: dto.quantity },
      });
    }

    return this.getCart(userId);
  }

  async removeFromCart(userId: string, itemId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({ where: { id: cartItem.id } });

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return {
      success: true,
      data: null,
      message: 'Cart cleared',
    };
  }
}
