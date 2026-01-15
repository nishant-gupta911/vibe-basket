import { PrismaService } from '../../config/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    getCart(userId: string): Promise<{
        success: boolean;
        data: {
            items: {
                product: {
                    id: string;
                    title: string;
                    description: string | null;
                    category: string;
                    price: number;
                    image: string | null;
                    inStock: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
                id: string;
                productId: string;
                quantity: number;
                cartId: string;
            }[];
            id: string;
            updatedAt: Date;
            userId: string;
        };
        message: string;
    }>;
    addToCart(userId: string, dto: AddToCartDto): Promise<{
        success: boolean;
        data: {
            items: {
                product: {
                    id: string;
                    title: string;
                    description: string | null;
                    category: string;
                    price: number;
                    image: string | null;
                    inStock: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
                id: string;
                productId: string;
                quantity: number;
                cartId: string;
            }[];
            id: string;
            updatedAt: Date;
            userId: string;
        };
        message: string;
    }>;
    updateCartItem(userId: string, itemId: string, dto: UpdateCartItemDto): Promise<{
        success: boolean;
        data: {
            items: {
                product: {
                    id: string;
                    title: string;
                    description: string | null;
                    category: string;
                    price: number;
                    image: string | null;
                    inStock: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
                id: string;
                productId: string;
                quantity: number;
                cartId: string;
            }[];
            id: string;
            updatedAt: Date;
            userId: string;
        };
        message: string;
    }>;
    removeFromCart(userId: string, itemId: string): Promise<{
        success: boolean;
        data: {
            items: {
                product: {
                    id: string;
                    title: string;
                    description: string | null;
                    category: string;
                    price: number;
                    image: string | null;
                    inStock: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
                id: string;
                productId: string;
                quantity: number;
                cartId: string;
            }[];
            id: string;
            updatedAt: Date;
            userId: string;
        };
        message: string;
    }>;
    clearCart(userId: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
}
