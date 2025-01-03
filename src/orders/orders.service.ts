import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateNewOrderDto } from './dto/orders.dto';

@Injectable()
export class OrdersService {
  private prisma = new PrismaClient();

  async getOrderItemsFromOrderId(order_id: number) {
    try {
      const orderItems = await this.prisma.orderItem.findMany({
        where: {
          order_id,
        },
      });

      if (orderItems && orderItems?.length) {
        return {
          order_items: orderItems,
          message: 'Order items retrieved successfully.',
        };
      } else {
        return {
          message: 'No order items found for the provided order ID.',
        };
      }
    } catch (error) {
      return {
        message: 'Failed to get order items',
        error: error.message,
      };
    }
  }

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
