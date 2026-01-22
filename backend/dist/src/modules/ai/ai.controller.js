"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const common_1 = require("@nestjs/common");
const chatbot_service_1 = require("./chatbot.service");
const recommendation_service_1 = require("./recommendation.service");
const prisma_service_1 = require("../../config/prisma.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const embedding_service_1 = require("./embedding.service");
let AIController = class AIController {
    constructor(prisma) {
        this.prisma = prisma;
        this.chatbotService = new chatbot_service_1.ChatbotService(prisma);
        this.recommendationService = new recommendation_service_1.RecommendationService(prisma);
    }
    async chat(body) {
        if (!body.message) {
            return {
                success: false,
                data: null,
                message: 'Message is required'
            };
        }
        try {
            const response = await this.chatbotService.chat(body.message, body.history);
            return {
                success: true,
                data: response,
                message: 'OK'
            };
        }
        catch (error) {
            console.error('Chat error:', error);
            return {
                success: false,
                data: null,
                message: error.message || 'Failed to process chat message'
            };
        }
    }
    async getMoodRecommendations(body) {
        if (!body.occasion || !body.mood || !body.budget) {
            return {
                success: false,
                data: null,
                message: 'Occasion, mood, and budget are required'
            };
        }
        if (body.budget <= 0) {
            return {
                success: false,
                data: null,
                message: 'Budget must be greater than 0'
            };
        }
        try {
            const recommendations = await this.recommendationService.getMoodRecommendations(body);
            return {
                success: true,
                data: recommendations,
                message: 'OK'
            };
        }
        catch (error) {
            console.error('Mood recommendation error:', error);
            return {
                success: false,
                data: null,
                message: error.message || 'Failed to generate recommendations'
            };
        }
    }
    async embedProducts() {
        try {
            const products = await this.prisma.product.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    category: true,
                },
            });
            if (products.length === 0) {
                return {
                    message: 'No products found',
                    embedded: 0,
                };
            }
            let embedded = 0;
            const batchSize = 10;
            for (let i = 0; i < products.length; i += batchSize) {
                const batch = products.slice(i, i + batchSize);
                const texts = batch.map((p) => {
                    return `${p.title}. ${p.description || ''}. Category: ${p.category}`;
                });
                const embeddings = await embedding_service_1.embeddingService.generateBatchEmbeddings(texts);
                for (let j = 0; j < batch.length; j++) {
                    const product = batch[j];
                    const embedding = embeddings[j].embedding;
                    await this.prisma.$executeRaw `
            UPDATE "Product"
            SET embedding = ${JSON.stringify(embedding)}::vector
            WHERE id = ${product.id}
          `;
                    embedded++;
                }
                if (i + batchSize < products.length) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
            }
            return {
                message: 'Products embedded successfully',
                embedded,
                total: products.length,
            };
        }
        catch (error) {
            console.error('Embedding error:', error);
            throw new common_1.HttpException('Failed to embed products', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async semanticSearch(body) {
        if (!body.query) {
            throw new common_1.HttpException('Query is required', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const productIds = await this.chatbotService.semanticSearch(body.query, body.limit || 10);
            const products = await this.prisma.product.findMany({
                where: {
                    id: { in: productIds },
                },
            });
            return { products };
        }
        catch (error) {
            console.error('Semantic search error:', error);
            throw new common_1.HttpException('Failed to search products', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AIController = AIController;
__decorate([
    (0, common_1.Post)('chat'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "chat", null);
__decorate([
    (0, common_1.Post)('mood'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "getMoodRecommendations", null);
__decorate([
    (0, common_1.Post)('embed-products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AIController.prototype, "embedProducts", null);
__decorate([
    (0, common_1.Post)('semantic-search'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "semanticSearch", null);
exports.AIController = AIController = __decorate([
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AIController);
//# sourceMappingURL=ai.controller.js.map