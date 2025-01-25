import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

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

export class CancelOrderDto {
  @IsNotEmpty()
  order_id: number;
}
