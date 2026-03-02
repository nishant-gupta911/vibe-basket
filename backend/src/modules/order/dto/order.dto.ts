import { IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsString()
  region?: string;
}

export class QueryOrderDto {
  @IsString()
  @IsOptional()
  status?: string;
}
