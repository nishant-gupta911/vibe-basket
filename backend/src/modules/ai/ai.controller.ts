import { Controller, Post, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ChatbotService, ChatMessage } from './chatbot.service';
import { RecommendationService, MoodRequest } from './recommendation.service';
import { PrismaService } from '../../config/prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { embeddingService } from './embedding.service';

@Controller('ai')
export class AIController {
  private chatbotService: ChatbotService;
  private recommendationService: RecommendationService;

  constructor(private prisma: PrismaService) {
    this.chatbotService = new ChatbotService(prisma);
    this.recommendationService = new RecommendationService(prisma);
  }

  @Post('chat')
  @UseGuards(JwtAuthGuard)
  async chat(
    @Body() body: { message: string; history?: ChatMessage[] }
  ) {
    if (!body.message) {
      throw new HttpException('Message is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await this.chatbotService.chat(body.message, body.history);
      return response;
    } catch (error) {
      console.error('Chat error:', error);
      throw new HttpException('Failed to process chat message', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('mood')
  @UseGuards(JwtAuthGuard)
  async getMoodRecommendations(@Body() body: MoodRequest) {
    if (!body.occasion || !body.mood || !body.budget) {
      throw new HttpException(
        'Occasion, mood, and budget are required',
        HttpStatus.BAD_REQUEST
      );
    }

    if (body.budget <= 0) {
      throw new HttpException('Budget must be greater than 0', HttpStatus.BAD_REQUEST);
    }

    try {
      const recommendations = await this.recommendationService.getMoodRecommendations(body);
      return recommendations;
    } catch (error) {
      console.error('Mood recommendation error:', error);
      throw new HttpException(
        'Failed to generate recommendations',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('embed-products')
  @UseGuards(JwtAuthGuard)
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

      // Process in batches to avoid rate limits
      const batchSize = 10;
      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);

        const texts = batch.map((p) => {
          return `${p.title}. ${p.description || ''}. Category: ${p.category}`;
        });

        const embeddings = await embeddingService.generateBatchEmbeddings(texts);

        // Update products with embeddings
        for (let j = 0; j < batch.length; j++) {
          const product = batch[j];
          const embedding = embeddings[j].embedding;

          await this.prisma.$executeRaw`
            UPDATE "Product"
            SET embedding = ${JSON.stringify(embedding)}::vector
            WHERE id = ${product.id}
          `;

          embedded++;
        }

        // Small delay between batches
        if (i + batchSize < products.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      return {
        message: 'Products embedded successfully',
        embedded,
        total: products.length,
      };
    } catch (error) {
      console.error('Embedding error:', error);
      throw new HttpException('Failed to embed products', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('semantic-search')
  @UseGuards(JwtAuthGuard)
  async semanticSearch(@Body() body: { query: string; limit?: number }) {
    if (!body.query) {
      throw new HttpException('Query is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const productIds = await this.chatbotService.semanticSearch(
        body.query,
        body.limit || 10
      );

      const products = await this.prisma.product.findMany({
        where: {
          id: { in: productIds },
        },
      });

      return { products };
    } catch (error) {
      console.error('Semantic search error:', error);
      throw new HttpException('Failed to search products', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
