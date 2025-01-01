import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateNewOrderDto } from './dto/orders.dto';

@Injectable()
export class OrdersService {
  private prisma = new PrismaClient();

  async createNewOrder(createNewOrderPayload: CreateNewOrderDto) {
    const { user_id, items, total } = createNewOrderPayload;

    try {
      return await this.prisma.$transaction(async (prisma) => {
        const order = await prisma.order.create({
          data: {
            user_id,
            total,
          },
        });

        await prisma.orderItem.createMany({
          data: items.map((item) => ({
            order_id: order.order_id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          })),
        });

        return {
          message: 'Order created successfully.',
          order_id: order.order_id,
        };
      });
    } catch (error) {
      return {
        message: 'Failed to create order. Please try again later.',
        error: error.message,
      };
    }
  }
}
