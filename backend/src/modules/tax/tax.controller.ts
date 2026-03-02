import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { TaxService } from './tax.service';
import { CreateTaxRateDto } from './dto/tax.dto';

@Controller('tax')
export class TaxController {
  constructor(private taxService: TaxService) {}

  @Get()
  @UseGuards(AdminGuard)
  list() {
    return this.taxService.listRates();
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() dto: CreateTaxRateDto) {
    return this.taxService.createRate(dto);
  }
}
