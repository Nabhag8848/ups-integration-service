import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { GetShippingRatesRequestDto } from './dtos/get-shipping-rates-request.dto';
import { RatesRegistryService } from './registry/rates.registry';
import { RateQuotesResponseDto } from './dtos';

@ApiTags('rates')
@Controller('rates')
export class RatesController {
  constructor(private readonly ratesRegistryService: RatesRegistryService) {}

  @Post('/:carrier')
  @ApiOperation({ summary: 'Get shipping rates for a carrier' })
  @ApiParam({ name: 'carrier', example: 'ups', description: 'Carrier identifier' })
  @ApiResponse({ status: 200, type: RateQuotesResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request payload' })
  @ApiResponse({ status: 404, description: 'Carrier not found' })
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
