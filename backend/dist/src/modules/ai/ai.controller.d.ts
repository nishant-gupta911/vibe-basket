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
    }): Promise<{
        success: boolean;
        data: import("./chatbot.service").ChatResponse;
        message: string;
    } | {
        success: boolean;
        data: any;
        message: any;
    }>;
    getMoodRecommendations(body: MoodRequest): Promise<{
        success: boolean;
        data: import("./recommendation.service").MoodRecommendation;
        message: string;
    } | {
        success: boolean;
        data: any;
        message: any;
    }>;
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
