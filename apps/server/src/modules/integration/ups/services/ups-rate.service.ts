import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AbstractRateService } from '@/modules/api/rates/service/abstract-rate.service';
import { UPSRateRequestDto } from '../dtos';
import { UPSOAuthService } from './ups-oauth.service';
import { TransformRequestPayload } from '@/utils';
import { RateQuotesResponseDto } from '@/modules/api/rates/dtos';
import { UPS_TO_UNIFIED_SERVICE_CODE } from '@/modules/integration/ups/maps';

@Injectable()
export class UPSRateService extends AbstractRateService<UPSRateRequestDto> {
  readonly name = 'ups';
  private ratingEndpoint;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly upsOAuthService: UPSOAuthService
  ) {
    super();
    this.ratingEndpoint = this.configService.getOrThrow('UPS_RATING_ENDPOINT');
  }

  @TransformRequestPayload(UPSRateRequestDto)
  async getShippingRates(
    shipment: UPSRateRequestDto
  ): Promise<RateQuotesResponseDto> {
    const accessToken = await this.upsOAuthService.getAccessToken();

    const body = {
      RateRequest: {
        Request: { Subversion: '2409' },
        Shipment: shipment,
      },
    };

    const { service } = shipment;
    const endpointPath = service?.Code ? '/Rate' : '/Shop';

    let response;

    try {
      response = await firstValueFrom(
        this.httpService.post(`${this.ratingEndpoint}${endpointPath}`, body, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;

        switch (status) {
          case 400:
            throw new BadRequestException('Invalid request');
          case 401:
            throw new UnauthorizedException('Unauthorized request');
          case 403:
            throw new ForbiddenException('Blocked merchant');
          case 429:
            throw new HttpException(
              'Rate limit exceeded',
              HttpStatus.TOO_MANY_REQUESTS
            );
        }
      }

      throw error;
    }

    const ratedShipments = response.data?.RateResponse?.RatedShipment ?? [];
    const shipments = Array.isArray(ratedShipments)
      ? ratedShipments
      : [ratedShipments];

    return {
      quotes: shipments.map((rated) => ({
        service: {
          type:
            UPS_TO_UNIFIED_SERVICE_CODE[rated.Service.Code] ??
            rated.Service.Code,
        },
        totalCharges: {
          currencyCode: rated.TotalCharges.CurrencyCode,
          monetaryValue: Number(rated.TotalCharges.MonetaryValue),
        },
        transportationCharges: {
          currencyCode: rated.TransportationCharges.CurrencyCode,
          monetaryValue: Number(rated.TransportationCharges.MonetaryValue),
        },
      })),
    };
  }
}
