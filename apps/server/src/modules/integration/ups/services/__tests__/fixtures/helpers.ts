import { AxiosError, AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { HttpService } from '@nestjs/axios';
import { UPSRateService } from '../../ups-rate.service';
import { UPSOAuthService } from '../../ups-oauth.service';
import { UPSRateRequestDto } from '../../../dtos';
import {
  GetShippingRatesRequestDto,
  RateQuotesResponseDto,
} from '../../../../../api/rates/dtos';

export function axiosResponse<T>(data: T, status = 200): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: { headers: new AxiosHeaders() },
  };
}

export function axiosError(status: number, data?: unknown): AxiosError {
  return new AxiosError(
    `Request failed with status code ${status}`,
    AxiosError.ERR_BAD_REQUEST,
    { headers: new AxiosHeaders() } as InternalAxiosRequestConfig,
    {},
    {
      data,
      status,
      statusText: status === 400 ? 'Bad Request' : 'Error',
      headers: {},
      config: { headers: new AxiosHeaders() },
    }
  );
}

/** Type-safe accessor for the mocked HttpService.post */
export function mockHttpPost(httpService: HttpService): jest.Mock {
  return httpService.post as unknown as jest.Mock ;
}

/** Type-safe accessor for the mocked OAuthService.getAccessToken */
export function mockGetAccessToken(oauthService: UPSOAuthService): jest.Mock  {
  return oauthService.getAccessToken as unknown as jest.Mock ;
}

/**
 * The @TransformRequestPayload decorator makes getShippingRates accept
 * GetShippingRatesRequestDto at runtime, even though the TS signature
 * declares UPSRateRequestDto. This helper provides a properly typed
 * call interface so every test call site stays type-safe with a single
 * cast in one place.
 */
export function callGetShippingRates(
  service: UPSRateService,
  request: GetShippingRatesRequestDto
): Promise<RateQuotesResponseDto> {
  return service.getShippingRates(request as unknown as UPSRateRequestDto);
}
