import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  getWishlist(@Request() req) {
    return this.wishlistService.getWishlist(req.user.userId);
  }

  @Post(':productId')
  addToWishlist(@Request() req, @Param('productId') productId: string) {
    return this.wishlistService.addToWishlist(req.user.userId, productId);
  }

  @Delete(':productId')
  removeFromWishlist(@Request() req, @Param('productId') productId: string) {
    return this.wishlistService.removeFromWishlist(req.user.userId, productId);
  }
}
