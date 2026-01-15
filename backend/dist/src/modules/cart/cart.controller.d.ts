import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
export declare class CartController {
    private cartService;
    constructor(cartService: CartService);
    getCart(req: any): Promise<{
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
    addToCart(req: any, dto: AddToCartDto): Promise<{
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
    updateCartItem(req: any, itemId: string, dto: UpdateCartItemDto): Promise<{
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
    removeFromCart(req: any, itemId: string): Promise<{
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
    clearCart(req: any): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
}
