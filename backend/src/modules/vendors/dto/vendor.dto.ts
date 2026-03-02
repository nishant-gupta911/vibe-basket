import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ApplyVendorDto {
  @IsOptional()
  @IsBoolean()
  verified?: boolean;
}

export class CreatePayoutDto {
  @IsString()
  vendorId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;
}
