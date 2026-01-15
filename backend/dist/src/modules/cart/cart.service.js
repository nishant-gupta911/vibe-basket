"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
let CartService = class CartService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCart(userId) {
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
        const itemsWithProducts = await Promise.all(cart.items.map(async (item) => {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
            });
            return {
                ...item,
                product,
            };
        }));
        return {
            success: true,
            data: {
                ...cart,
                items: itemsWithProducts,
            },
            message: 'Cart retrieved',
        };
    }
    async addToCart(userId, dto) {
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (!product.inStock) {
            throw new common_1.BadRequestException('Product out of stock');
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
        if (existingItem) {
            await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + dto.quantity },
            });
        }
        else {
            await this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: dto.productId,
                    quantity: dto.quantity,
                },
            });
        }
        return this.getCart(userId);
    }
    async updateCartItem(userId, itemId, dto) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        if (dto.quantity === 0) {
            await this.prisma.cartItem.delete({
                where: { id: itemId },
            });
        }
        else {
            await this.prisma.cartItem.update({
                where: { id: itemId },
                data: { quantity: dto.quantity },
            });
        }
        return this.getCart(userId);
    }
    async removeFromCart(userId, itemId) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        await this.prisma.cartItem.delete({
            where: { id: itemId },
        });
        return this.getCart(userId);
    }
    async clearCart(userId) {
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
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map