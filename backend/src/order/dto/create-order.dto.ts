import { IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  cartId: string;

  @IsString()
  paymentMethod: string;
}
