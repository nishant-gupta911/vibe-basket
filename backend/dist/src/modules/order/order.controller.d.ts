import { OrderService } from './order.service';
import { QueryOrderDto } from './dto/order.dto';
export declare class OrderController {
    private orderService;
    constructor(orderService: OrderService);
    createOrder(req: any): Promise<{
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
    getOrders(req: any, query: QueryOrderDto): Promise<{
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
    getOrder(req: any, id: string): Promise<{
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
