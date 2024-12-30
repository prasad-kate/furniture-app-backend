import { IsNotEmpty } from 'class-validator';

export class CreateNewOrderDto {
  @IsNotEmpty()
  product_id: number;

  @IsNotEmpty()
  total: number;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  order_status: 'PENDING' | 'DELIVERED' | 'CANCELLED';
}
