import { Injectable } from '@nestjs/common';
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

    const response = await firstValueFrom(
      this.httpService.post(`${this.ratingEndpoint}${endpointPath}`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
    );

    const ratedShipments = response.data?.RateResponse?.RatedShipment ?? [];
    const shipments = Array.isArray(ratedShipments)
      ? ratedShipments
      : [ratedShipments];

    return {
      quotes: shipments.map((rated) => ({
        service: {
          code:
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
