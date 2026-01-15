import { Controller, Get, Query, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { QueryProductDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getProducts(@Query() query: QueryProductDto) {
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
}
