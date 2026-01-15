import { PrismaService } from '../../config/prisma.service';
export interface MoodRequest {
    occasion: string;
    mood: string;
    budget: number;
    gender?: string;
    age?: number;
}
export interface ProductSuggestion {
    productId: string;
    reason: string;
    product?: {
        id: string;
        title: string;
        price: number;
        image: string;
        category: string;
    };
}
export interface MoodRecommendation {
    suggestions: ProductSuggestion[];
}
export declare class RecommendationService {
    private prisma;
    constructor(prisma: PrismaService);
    getMoodRecommendations(request: MoodRequest): Promise<MoodRecommendation>;
    private getFallbackRecommendations;
    semanticProductSearch(query: string, limit?: number): Promise<string[]>;
}
