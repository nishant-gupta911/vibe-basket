import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTaxRateDto {
  @IsString()
  region: string;

  @IsNumber()
  @Min(0)
  rate: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
