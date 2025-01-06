import { OrderStatus } from '@prisma/client';
import { IsArray, IsEnum, IsInt, IsNotEmpty } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  product_id: number;

  @IsInt()
  quantity: number;

  @IsInt()
  price: number;
}

export class CreateNewOrderDto {
  @IsInt()
  user_id: number;

  @IsInt()
  total: number;

  @IsArray()
  @IsNotEmpty()
  items: CreateOrderItemDto[];
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  order_status: OrderStatus;

  @IsNotEmpty()
  order_id: number;
}
