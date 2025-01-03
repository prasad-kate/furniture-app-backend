import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateNewOrderDto } from './dto/orders.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':order_id')
  getOrderItemsFromOrderId(@Param('order_id') order_id: number) {
    return this.ordersService.getOrderItemsFromOrderId(Number(order_id));
  }

  @Post('create')
  createNewOrder(@Body() createNewOrderPayload: CreateNewOrderDto) {
    return this.ordersService.createNewOrder(createNewOrderPayload);
  }
}
