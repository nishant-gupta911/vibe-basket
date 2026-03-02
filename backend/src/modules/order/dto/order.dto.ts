import { IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  couponCode?: string;
}

export class QueryOrderDto {
  @IsString()
  @IsOptional()
  status?: string;
}
