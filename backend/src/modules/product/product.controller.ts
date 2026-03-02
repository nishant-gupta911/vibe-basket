import { Controller, Get, Query, Param, Post, Body, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { ProductService } from './product.service';
import { QueryProductDto, CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  getProducts(@Request() req, @Query() query: QueryProductDto) {
    return this.productService.getProducts(query, req.user || null);
  }

  @Get('search')
  @UseGuards(OptionalJwtAuthGuard)
  searchProducts(@Request() req, @Query() query: QueryProductDto) {
    return this.productService.getProducts(query, req.user || null);
  }

  @Get('categories')
  @UseGuards(OptionalJwtAuthGuard)
  getCategories(@Request() req) {
    return this.productService.getCategories(req.user || null);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  getProduct(@Request() req, @Param('id') id: string) {
    return this.productService.getProduct(id, req.user || null);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.updateProduct(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
