import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AbstractRateService } from '@/modules/api/rates/service/abstract-rate.service';
import { UPSRateRequestDto } from '../dtos';
import { UPSOAuthService } from './ups-oauth.service';
import { TransformRequestPayload } from '@/utils';

@Injectable()
export class UPSRateService extends AbstractRateService<
  UPSRateRequestDto,
  unknown
> {
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
  async getShippingRates(shipment: UPSRateRequestDto): Promise<unknown> {
    const accessToken = await this.upsOAuthService.getAccessToken();

    const body = {
      RateRequest: {
        Request: { Subversion: '2409' },
        Shipment: shipment,
      },
    };

    const response = await firstValueFrom(
      this.httpService.post(`${this.ratingEndpoint}/Shop`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
    );

    return response.data;
  }
}
