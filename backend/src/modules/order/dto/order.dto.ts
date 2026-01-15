import { IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  // Order will be created from cart items
}

export class QueryOrderDto {
  @IsString()
  @IsOptional()
  status?: string;
}
