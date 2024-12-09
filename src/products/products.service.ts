import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProductsService {
  private prisma = new PrismaClient();

  async findAll() {
    return this.prisma.products.findMany();
  }

  async findOne(id: number) {
    return this.prisma.products.findUnique({
      where: { id },
    });
  }
}
