import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProductsService {
  private prisma = new PrismaClient();

  private readonly productsObj = {
    id: true,
    name: true,
    description: true,
    image: true,
    price: true,
    stars: true,
    category_id: true,
  };

  async findAll() {
    return this.prisma.products.findMany({
      select: this.productsObj,
    });
  }

  async findOne(id: number) {
    return this.prisma.products.findUnique({
      where: { id },
      select: this.productsObj,
    });
  }

  async findAllCategories() {
    return this.prisma.productsCategory.findMany();
  }
}
