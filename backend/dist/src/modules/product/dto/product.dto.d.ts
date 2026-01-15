export declare class CreateProductDto {
    title: string;
    description?: string;
    category: string;
    price: number;
    image?: string;
    inStock?: boolean;
}
export declare class QueryProductDto {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
}
