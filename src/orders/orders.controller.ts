import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { CreateNewOrderDto, UpdateOrderStatusDto } from './dto/orders.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':order_id')
  getOrderItemsFromOrderId(@Param('order_id') order_id: number) {
    return this.ordersService.getOrderItemsFromOrderId(Number(order_id));
  }

  @Get()
  async getOrders(@Query('order_status') order_status?: string) {
    if (order_status) {
      if (
        !Object.values(OrderStatus).includes(
          order_status.toUpperCase() as OrderStatus,
        )
      ) {
        throw new HttpException(
          `Invalid order_status value. Valid values are: ${Object.values(OrderStatus).join(', ')}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      return this.ordersService.getOrdersFromStatus(
        order_status.toUpperCase() as OrderStatus,
      );
    }

    return this.ordersService.getAllOrders();
  }

  @Post('create')
  createNewOrder(@Body() createNewOrderPayload: CreateNewOrderDto) {
    return this.ordersService.createNewOrder(createNewOrderPayload);
  }

  @Patch('update_status')
  async updateOrderStatus(@Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.updateOrderStatus(updateOrderStatusDto);
  }
}
