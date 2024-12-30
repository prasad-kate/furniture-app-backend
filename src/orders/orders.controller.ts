import { Body, Controller, Post } from '@nestjs/common';
import { CreateNewOrderDto } from './dto/orders.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create')
  createNewOrder(@Body() createNewOrderPayload: CreateNewOrderDto) {
    return this.ordersService.createNewOrder(createNewOrderPayload);
  }
}
