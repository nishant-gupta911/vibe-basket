import { Controller, Get, Query, Param, Post, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { QueryProductDto, CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getProducts(@Query() query: QueryProductDto) {
    return this.productService.getProducts(query);
  }

  @Get('search')
  searchProducts(@Query() query: QueryProductDto) {
    return this.productService.getProducts(query);
  }

  @Get('categories')
  getCategories() {
    return this.productService.getCategories();
  }

  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productService.getProduct(id);
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
