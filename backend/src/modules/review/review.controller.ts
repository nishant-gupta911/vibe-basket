import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('products/:productId/reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get()
  getReviews(@Param('productId') productId: string) {
    return this.reviewService.getReviews(productId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  addReview(
    @Request() req,
    @Param('productId') productId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewService.addReview(req.user.userId, productId, dto);
  }
}
