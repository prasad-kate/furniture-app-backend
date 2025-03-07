import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderStatus, PrismaClient } from '@prisma/client';
import { CancelOrderDto, CreateNewOrderDto } from './dto/orders.dto';

@Injectable()
export class OrdersService {
  private prisma = new PrismaClient();

  private readonly ordersObj = {
    user_id: true,
    createdAt: true,
    order_id: true,
    order_status: true,
    orderItems: true,
    total: true,
  };

  async getAllOrders() {
    try {
      const orders = await this.prisma.order.findMany({
        select: this.ordersObj,
      });

      if (!orders?.length) {
        return {
          message: 'Failed to get orders.',
          orders: [],
        };
      }

      return {
        orders,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          message: 'Failed to get orders',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getOrdersFromStatus(order_status: OrderStatus) {
    try {
      const orders = await this.prisma.order.findMany({
        where: { order_status },
        select: this.ordersObj,
      });

      if (!orders.length) {
        return {
          message: `No orders found with status '${order_status}'.`,
          orders: [],
        };
      }

      return {
        orders,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          message: 'Failed to get orders',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getOrderItemsFromOrderId(order_id: number) {
    try {
      const orderItems = await this.prisma.orderItem.findMany({
        where: {
          order_id,
        },
        include: {
          product: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });

      if (orderItems && orderItems.length) {
        const result = orderItems.map((item) => ({
          order_item_id: item.order_item_id,
          order_id: item.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          product_name: item.product.name,
          image: item.product.image,
        }));

        return {
          order_items: result,
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
      console.log(error);
      throw new HttpException(
        {
          message: 'Failed to process your order. Please try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cancelOrder(cancelOrderStatusPayload: CancelOrderDto) {
    const { order_id } = cancelOrderStatusPayload;

    try {
      const order = this.prisma.order.findUnique({
        where: {
          order_id,
        },
      });
      if (!order) {
        throw new HttpException(
          {
            message: 'Order with the given ID not found.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      await this.prisma.order.update({
        where: { order_id },
        data: {
          order_status: 'CANCELLED',
        },
      });

      return {
        message: 'Order cancelled successfully',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          message: 'Failed to cancel the order. Please try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
