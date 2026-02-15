import { Controller, Post, Body, HttpException, HttpStatus, BadRequestException, HttpCode } from '@nestjs/common';
import { ChatbotService, ChatMessage } from './chatbot.service';
import { RecommendationService, MoodRequest } from './recommendation.service';
import { PrismaService } from '../../config/prisma.service';
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
  @HttpCode(200)
  async chat(
    @Body() body: { message: string; history?: ChatMessage[] }
  ) {
    if (!body?.message?.trim()) {
      throw new BadRequestException('Message is required');
    }

    try {
      const response = await this.chatbotService.chat(body.message, body.history || []);
      return {
        success: true,
        data: response,
        message: 'OK'
      };
    } catch (error) {
      console.error('Chat error:', error);
      return {
        success: false,
        data: {
          reply: "I'm having trouble right now. Please try again in a moment.",
          productIds: null,
        },
        message: error.message || 'Failed to process chat message'
      };
    }
  }

  @Post('mood')
  @HttpCode(200)
  async getMoodRecommendations(@Body() body: MoodRequest) {
    if (!body?.occasion?.trim() || !body?.mood?.trim() || body?.budget === undefined) {
      throw new BadRequestException('Occasion, mood, and budget are required');
    }

    if (body.budget <= 0) {
      throw new BadRequestException('Budget must be greater than 0');
    }

    try {
      const recommendations = await this.recommendationService.getMoodRecommendations(body);
      return {
        success: true,
        data: recommendations,
        message: 'OK'
      };
    } catch (error) {
      console.error('Mood recommendation error:', error);
      return {
        success: false,
        data: { suggestions: [] },
        message: error.message || 'Failed to generate recommendations'
      };
    }
  }

  @Post('embed-products')
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
      let vectorColumnAvailable = true;

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

          if (vectorColumnAvailable) {
            try {
              await this.prisma.$executeRaw`
                UPDATE "Product"
                SET embedding = ${JSON.stringify(embedding)}::vector
                WHERE id = ${product.id}
              `;
            } catch {
              vectorColumnAvailable = false;
            }
          }

          embedded++;
        }

        // Small delay between batches
        if (i + batchSize < products.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      return {
        message: vectorColumnAvailable
          ? 'Products embedded successfully'
          : 'Products processed, but embedding column is not available in schema',
        embedded,
        total: products.length,
      };
    } catch (error) {
      console.error('Embedding error:', error);
      throw new HttpException('Failed to embed products', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Post('semantic-search')
  // Deprecated: Use /chat endpoint with product_search intent instead
  // async semanticSearch(@Body() body: { query: string; limit?: number }) {
  //   if (!body.query) {
  //     throw new HttpException('Query is required', HttpStatus.BAD_REQUEST);
  //   }
  //
  //   try {
  //     const productIds = await this.chatbotService.semanticSearch(
  //       body.query,
  //       body.limit || 10
  //     );
  //
  //     const products = await this.prisma.product.findMany({
  //       where: {
  //         id: { in: productIds },
  //       },
  //     });
  //
  //     return { products };
  //   } catch (error) {
  //     console.error('Semantic search error:', error);
  //     throw new HttpException('Failed to search products', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
}
