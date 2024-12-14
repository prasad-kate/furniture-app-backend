import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Get all products
  @Get()
  async getAllProducts() {
    return this.productsService.findAll();
  }

  @Get('categories')
  async getProductsCategories() {
    return this.productsService.findAllCategories();
  }

  // Get a product by ID
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.findOne(Number(id));
  }
}
