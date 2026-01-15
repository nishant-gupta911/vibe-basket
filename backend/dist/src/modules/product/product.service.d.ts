import { PrismaService } from '../../config/prisma.service';
import { QueryProductDto } from './dto/product.dto';
export declare class ProductService {
    private prisma;
    constructor(prisma: PrismaService);
    getProducts(query: QueryProductDto): Promise<{
        success: boolean;
        data: {
            products: {
                id: string;
                title: string;
                description: string | null;
                category: string;
                price: number;
                image: string | null;
                inStock: boolean;
                createdAt: Date;
                updatedAt: Date;
            }[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                pages: number;
            };
        };
        message: string;
    }>;
    getProduct(id: string): Promise<{
        success: boolean;
        data: {
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
        message: string;
    }>;
    getCategories(): Promise<{
        success: boolean;
        data: {
            name: string;
            count: number;
        }[];
        message: string;
    }>;
}
