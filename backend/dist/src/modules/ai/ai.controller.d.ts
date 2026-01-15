import { ChatMessage } from './chatbot.service';
import { MoodRequest } from './recommendation.service';
import { PrismaService } from '../../config/prisma.service';
export declare class AIController {
    private prisma;
    private chatbotService;
    private recommendationService;
    constructor(prisma: PrismaService);
    chat(body: {
        message: string;
        history?: ChatMessage[];
    }): Promise<import("./chatbot.service").ChatResponse>;
    getMoodRecommendations(body: MoodRequest): Promise<import("./recommendation.service").MoodRecommendation>;
    embedProducts(): Promise<{
        message: string;
        embedded: number;
        total?: undefined;
    } | {
        message: string;
        embedded: number;
        total: number;
    }>;
    semanticSearch(body: {
        query: string;
        limit?: number;
    }): Promise<{
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
    }>;
}
