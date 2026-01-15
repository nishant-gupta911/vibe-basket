import { PrismaService } from '../../config/prisma.service';
export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}
export interface ChatResponse {
    reply: string;
    productIds: string[] | null;
}
export declare class ChatbotService {
    private prisma;
    constructor(prisma: PrismaService);
    chat(message: string, conversationHistory?: ChatMessage[]): Promise<ChatResponse>;
    semanticSearch(query: string, limit?: number): Promise<string[]>;
    private extractProductIds;
}
