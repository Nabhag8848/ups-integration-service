import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetShippingRatesRequestDto } from './dtos/get-shipping-rates-request.dto';
import { RatesRegistryService } from './registry/rates.registry';
import { RateQuotesResponseDto } from './dtos';

@ApiTags('rates')
@Controller('rates')
export class RatesController {
  constructor(private readonly ratesRegistryService: RatesRegistryService) {}

  @Post('/:carrier')
  @ApiOperation({
    summary: 'Get shipping rates for a carrier',
    description:
      'Accepts a unified shipping-rate request and returns unified quotes. ' +
      'If service is provided, the integration requests one specific service; ' +
      'if omitted, it shops across available services.',
  })
  @ApiParam({
    name: 'carrier',
    example: 'ups',
    description: 'Carrier identifier (registered integration name).',
  })
  @ApiBody({
    type: GetShippingRatesRequestDto,
    examples: {
      withService: {
        summary: 'Single-service quote',
        value: {
          origin: {
            addressLines: ['100 Commerce Blvd', 'Suite 200'],
            city: 'TIMONIUM',
            stateProvinceCode: 'MD',
            postalCode: '21093',
            countryCode: 'US',
          },
          destination: {
            addressLines: ['742 Evergreen Terrace'],
            city: 'Alpharetta',
            stateProvinceCode: 'GA',
            postalCode: '30005',
            countryCode: 'US',
          },
          package: [
            {
              dimensions: {
                unitOfMeasurement: 'IN',
                length: 10,
                width: 8,
                height: 6,
              },
              weight: {
                unitOfMeasurement: 'LBS',
                weight: 5,
              },
            },
          ],
          service: { type: 'GROUND' },
        },
      },
      withoutService: {
        summary: 'Shop quotes (service omitted)',
        value: {
          origin: {
            addressLines: ['100 Commerce Blvd', 'Suite 200'],
            city: 'TIMONIUM',
            stateProvinceCode: 'MD',
            postalCode: '21093',
            countryCode: 'US',
          },
          destination: {
            addressLines: ['742 Evergreen Terrace'],
            city: 'Alpharetta',
            stateProvinceCode: 'GA',
            postalCode: '30005',
            countryCode: 'US',
          },
          package: [
            {
              dimensions: {
                unitOfMeasurement: 'IN',
                length: 10,
                width: 8,
                height: 6,
              },
              weight: {
                unitOfMeasurement: 'LBS',
                weight: 5,
              },
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    type: RateQuotesResponseDto,
    description: 'Unified rate quotes.',
    schema: {
      example: {
        quotes: [
          {
            service: { type: 'GROUND' },
            totalCharges: { currencyCode: 'USD', monetaryValue: 15.72 },
            transportationCharges: {
              currencyCode: 'USD',
              monetaryValue: 12.35,
            },
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request payload' })
  @ApiResponse({ status: 401, description: 'Authentication failed upstream' })
  @ApiResponse({ status: 403, description: 'Carrier request blocked upstream' })
  @ApiResponse({
    status: 429,
    description: 'Carrier rate limit exceeded upstream',
  })
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
