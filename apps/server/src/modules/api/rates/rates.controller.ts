import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { GetShippingRatesRequestDto } from './dtos/get-shipping-rates-request.dto';
import { RatesRegistryService } from './registry/rates.registry';
import { RateQuotesResponseDto } from './dtos';

@Controller('rates')
export class RatesController {
  constructor(private readonly ratesRegistryService: RatesRegistryService) {}

  @Post('/:carrier')
  async getShippingRates(
    @Param('carrier') carrier: string,
    @Body() body: GetShippingRatesRequestDto
  ): Promise<RateQuotesResponseDto> {
    const ratesService = this.ratesRegistryService.getService(carrier);

    if (!ratesService) {
      throw new NotFoundException(
        `Rates service for carrier ${carrier} not found`
      );
    }

    return ratesService.getShippingRates(body);
  }
}
