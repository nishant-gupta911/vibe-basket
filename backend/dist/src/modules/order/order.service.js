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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
let OrderService = class OrderService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrder(userId) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: { items: true },
        });
        if (!cart || cart.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        let total = 0;
        const orderItems = [];
        for (const item of cart.items) {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product ${item.productId} not found`);
            }
            if (!product.inStock) {
                throw new common_1.BadRequestException(`Product ${product.title} is out of stock`);
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
        const order = await this.prisma.order.create({
            data: {
                userId,
                total,
                status: 'pending',
                items: orderItems,
            },
        });
        await this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
        return {
            success: true,
            data: order,
            message: 'Order created successfully',
        };
    }
    async getOrders(userId, status) {
        const where = { userId };
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
    async getOrder(userId, orderId) {
        const order = await this.prisma.order.findFirst({
            where: {
                id: orderId,
                userId,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return {
            success: true,
            data: order,
            message: 'Order retrieved',
        };
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrderService);
//# sourceMappingURL=order.service.js.map