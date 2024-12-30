import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateNewOrderDto } from './dto/orders.dto';

@Injectable()
export class OrdersService {
  private prisma = new PrismaClient();

  async createNewOrder(createNewOrderPayload: CreateNewOrderDto) {
    try {
      const { total, quantity, order_status, user_id, product_id } =
        createNewOrderPayload;

      this.prisma.order.create({
        data: {
          order_status,
          quantity,
          product_id,
          user_id,
          total,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
