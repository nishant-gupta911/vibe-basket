import { PrismaService } from '../../config/prisma.service';
export declare class OrderService {
    private prisma;
    constructor(prisma: PrismaService);
    createOrder(userId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            total: number;
            userId: string;
            items: import("@prisma/client/runtime/library").JsonValue;
            status: string;
        };
        message: string;
    }>;
    getOrders(userId: string, status?: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            total: number;
            userId: string;
            items: import("@prisma/client/runtime/library").JsonValue;
            status: string;
        }[];
        message: string;
    }>;
    getOrder(userId: string, orderId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            total: number;
            userId: string;
            items: import("@prisma/client/runtime/library").JsonValue;
            status: string;
        };
        message: string;
    }>;
}
