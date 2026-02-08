import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { AxiosError } from 'axios';
import { UPSRateService } from '../ups-rate.service';
import { UPSOAuthService } from '../ups-oauth.service';
import { ShippingServiceCode } from '../../../../api/rates/enum';
import { GetShippingRatesRequestDto } from '../../../../api/rates/dtos';
import {
  UNIFIED_RATE_REQUEST_WITH_SERVICE,
  UNIFIED_RATE_REQUEST_WITHOUT_SERVICE,
  STUB_OAUTH_TOKEN_RESPONSE,
  STUB_UPS_RATE_RESPONSE_SINGLE,
  STUB_UPS_RATE_RESPONSE_MULTIPLE,
  STUB_UPS_ERROR_400,
  STUB_UPS_ERROR_401,
  axiosResponse,
  axiosError,
  mockHttpPost,
  mockGetAccessToken,
  callGetShippingRates,
} from './fixtures';

describe('UPSRateService — Integration Tests', () => {
  let rateService: UPSRateService;
  let httpService: HttpService;
  let oauthService: UPSOAuthService;

  /**
   * Before each test we spin up a minimal NestJS testing module.
   *
   * What's real:
   *   - UPSRateService (the class under test, including its @TransformRequestPayload decorator)
   *
   * What's mocked:
   *   - HttpService.post() — stubbed to return fake UPS JSON (no real HTTP calls)
   *   - UPSOAuthService.getAccessToken() — returns a fake Bearer token
   *   - ConfigService.getOrThrow() — returns fake endpoint URLs
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UPSRateService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: UPSOAuthService,
          useValue: {
            getAccessToken: jest
              .fn()
              .mockResolvedValue(STUB_OAUTH_TOKEN_RESPONSE.access_token),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest
              .fn()
              .mockReturnValue('https://onlinetools.ups.com/api/rating/v2409'),
          },
        },
      ],
    }).compile();

    rateService = module.get<UPSRateService>(UPSRateService);
    httpService = module.get<HttpService>(HttpService);
    oauthService = module.get<UPSOAuthService>(UPSOAuthService);
  });

  // ─── Request Payload Building ──────────────────

  describe('Request Payload Building', () => {
    it('should build correct UPS request body from unified domain model', async () => {
      mockHttpPost(httpService).mockImplementation(() =>
        of(axiosResponse(STUB_UPS_RATE_RESPONSE_SINGLE))
      );

      await callGetShippingRates(rateService, UNIFIED_RATE_REQUEST_WITH_SERVICE);

      const [, body] = mockHttpPost(httpService).mock.calls[0];

      expect(body).toHaveProperty('RateRequest');
      expect(body.RateRequest).toHaveProperty('Request', {
        Subversion: '2409',
      });
      expect(body.RateRequest).toHaveProperty('Shipment');

      const shipment = body.RateRequest.Shipment;

      // Shipper (mapped from origin)
      expect(shipment.Shipper).toEqual({
        Address: {
          AddressLine: ['100 Commerce Blvd', 'Suite 200'],
          City: 'TIMONIUM',
          StateProvinceCode: 'MD',
          PostalCode: '21093',
          CountryCode: 'US',
        },
      });

      // ShipFrom (also mapped from origin)
      expect(shipment.ShipFrom).toEqual(shipment.Shipper);

      // ShipTo (mapped from destination)
      expect(shipment.ShipTo).toEqual({
        Address: {
          AddressLine: ['742 Evergreen Terrace'],
          City: 'Alpharetta',
          StateProvinceCode: 'GA',
          PostalCode: '30005',
          CountryCode: 'US',
        },
      });

      // Service code mapping: GROUND → '03'
      expect(shipment.Service).toEqual({ Code: '03' });

      // Package transformation
      expect(shipment.Package).toEqual([
        {
          Dimensions: {
            UnitOfMeasurement: { Code: 'IN', Description: 'Inches' },
            Length: '10',
            Width: '8',
            Height: '6',
          },
          PackageWeight: {
            UnitOfMeasurement: { Code: 'LBS', Description: 'Pounds' },
            Weight: '5',
          },
        },
      ]);
    });

    it('should use /Rate endpoint when service code is provided', async () => {
      mockHttpPost(httpService).mockReturnValue(
        of(axiosResponse(STUB_UPS_RATE_RESPONSE_SINGLE))
      );

      await callGetShippingRates(rateService, UNIFIED_RATE_REQUEST_WITH_SERVICE);

      const [url] = mockHttpPost(httpService).mock.calls[0];
      expect(url).toBe(
        'https://onlinetools.ups.com/api/rating/v2409/Rate'
      );
    });

    it('should use /Shop endpoint when no service code is provided', async () => {
      mockHttpPost(httpService).mockReturnValue(
        of(axiosResponse(STUB_UPS_RATE_RESPONSE_MULTIPLE))
      );

      await callGetShippingRates(
        rateService,
        UNIFIED_RATE_REQUEST_WITHOUT_SERVICE as GetShippingRatesRequestDto
      );

      const [url] = mockHttpPost(httpService).mock.calls[0];
      expect(url).toBe(
        'https://onlinetools.ups.com/api/rating/v2409/Shop'
      );
    });

    it('should send Bearer token in Authorization header', async () => {
      mockHttpPost(httpService).mockReturnValue(
        of(axiosResponse(STUB_UPS_RATE_RESPONSE_SINGLE))
      );

      await callGetShippingRates(rateService, UNIFIED_RATE_REQUEST_WITH_SERVICE);

      const [, , config] = mockHttpPost(httpService).mock.calls[0];
      expect(config.headers.Authorization).toBe(
        `Bearer ${STUB_OAUTH_TOKEN_RESPONSE.access_token}`
      );
      expect(config.headers['Content-Type']).toBe('application/json');
      expect(config.headers['Accept']).toBe('application/json');
    });

    it('should map NEXT_DAY_AIR service code to UPS code 01', async () => {
      const request: GetShippingRatesRequestDto = {
        ...UNIFIED_RATE_REQUEST_WITH_SERVICE,
        service: { type: ShippingServiceCode.NEXT_DAY_AIR },
      };

      mockHttpPost(httpService).mockReturnValue(
        of(
          axiosResponse({
            RateResponse: {
              ...STUB_UPS_RATE_RESPONSE_SINGLE.RateResponse,
              RatedShipment: {
                ...STUB_UPS_RATE_RESPONSE_SINGLE.RateResponse.RatedShipment,
                Service: { Code: '01', Description: 'UPS Next Day Air' },
              },
            },
          })
        )
      );

      await callGetShippingRates(rateService, request);

      const [, body] = mockHttpPost(httpService).mock.calls[0];
      expect(body.RateRequest.Shipment.Service).toEqual({ Code: '01' });
    });
  });

  // ─── Response Parsing & Normalization ──────────

  describe('Response Parsing & Normalization', () => {
    it('should parse single RatedShipment (non-array) into quotes array', async () => {
      mockHttpPost(httpService).mockReturnValue(
        of(axiosResponse(STUB_UPS_RATE_RESPONSE_SINGLE))
      );

      const result = await callGetShippingRates(
        rateService,
        UNIFIED_RATE_REQUEST_WITH_SERVICE
      );

      expect(result.quotes).toHaveLength(1);
      expect(result.quotes[0]).toEqual({
        service: { type: ShippingServiceCode.GROUND },
        totalCharges: { currencyCode: 'USD', monetaryValue: 15.72 },
        transportationCharges: { currencyCode: 'USD', monetaryValue: 12.35 },
      });
    });

    it('should parse multiple RatedShipments (array) into quotes array', async () => {
      mockHttpPost(httpService).mockReturnValue(
        of(axiosResponse(STUB_UPS_RATE_RESPONSE_MULTIPLE))
      );

      const result = await callGetShippingRates(
        rateService,
        UNIFIED_RATE_REQUEST_WITHOUT_SERVICE as GetShippingRatesRequestDto
      );

      expect(result.quotes).toHaveLength(3);

      expect(result.quotes[0]).toEqual({
        service: { type: ShippingServiceCode.GROUND },
        totalCharges: { currencyCode: 'USD', monetaryValue: 15.72 },
        transportationCharges: { currencyCode: 'USD', monetaryValue: 12.35 },
      });

      expect(result.quotes[1]).toEqual({
        service: { type: ShippingServiceCode.SECOND_DAY_AIR },
        totalCharges: { currencyCode: 'USD', monetaryValue: 33.1 },
        transportationCharges: { currencyCode: 'USD', monetaryValue: 28.5 },
      });

      expect(result.quotes[2]).toEqual({
        service: { type: ShippingServiceCode.NEXT_DAY_AIR },
        totalCharges: { currencyCode: 'USD', monetaryValue: 62.45 },
        transportationCharges: { currencyCode: 'USD', monetaryValue: 55.8 },
      });
    });

    it('should convert MonetaryValue strings to numbers', async () => {
      mockHttpPost(httpService).mockReturnValue(
        of(axiosResponse(STUB_UPS_RATE_RESPONSE_SINGLE))
      );

      const result = await callGetShippingRates(
        rateService,
        UNIFIED_RATE_REQUEST_WITH_SERVICE
      );

      expect(typeof result.quotes[0].totalCharges.monetaryValue).toBe(
        'number'
      );
      expect(typeof result.quotes[0].transportationCharges.monetaryValue).toBe(
        'number'
      );
    });

    it('should map unknown UPS service codes as-is when no unified mapping exists', async () => {
      const responseWithUnknownService = {
        RateResponse: {
          ...STUB_UPS_RATE_RESPONSE_SINGLE.RateResponse,
          RatedShipment: {
            ...STUB_UPS_RATE_RESPONSE_SINGLE.RateResponse.RatedShipment,
            Service: { Code: '99', Description: 'UPS Future Service' },
          },
        },
      };

      mockHttpPost(httpService).mockReturnValue(
        of(axiosResponse(responseWithUnknownService))
      );

      const result = await callGetShippingRates(
        rateService,
        UNIFIED_RATE_REQUEST_WITH_SERVICE
      );

      expect(result.quotes[0].service.type).toBe('99');
    });

    it('should return empty quotes array when RatedShipment is missing', async () => {
      const emptyResponse = {
        RateResponse: {
          Response: {
            ResponseStatus: { Code: '1', Description: 'Success' },
          },
        },
      };

      mockHttpPost(httpService).mockReturnValue(
        of(axiosResponse(emptyResponse))
      );

      const result = await callGetShippingRates(
        rateService,
        UNIFIED_RATE_REQUEST_WITH_SERVICE
      );

      expect(result.quotes).toEqual([]);
    });
  });

  // ─── Auth Token Lifecycle ──────────────────────

  describe('Auth Token Lifecycle', () => {
    it('should acquire token via UPSOAuthService before making rate request', async () => {
      mockHttpPost(httpService).mockReturnValue(
        of(axiosResponse(STUB_UPS_RATE_RESPONSE_SINGLE))
      );

      await callGetShippingRates(rateService, UNIFIED_RATE_REQUEST_WITH_SERVICE);

      expect(oauthService.getAccessToken).toHaveBeenCalledTimes(1);

      const [, , config] = mockHttpPost(httpService).mock.calls[0];
      expect(config.headers.Authorization).toContain(
        STUB_OAUTH_TOKEN_RESPONSE.access_token
      );
    });

    it('should use whatever token getAccessToken returns (simulating reuse from cache)', async () => {
      const cachedToken = 'cached-token-from-redis-abc123';
      mockGetAccessToken(oauthService).mockResolvedValue(cachedToken);
      mockHttpPost(httpService).mockReturnValue(
        of(axiosResponse(STUB_UPS_RATE_RESPONSE_SINGLE))
      );

      await callGetShippingRates(rateService, UNIFIED_RATE_REQUEST_WITH_SERVICE);

      const [, , config] = mockHttpPost(httpService).mock.calls[0];
      expect(config.headers.Authorization).toBe(`Bearer ${cachedToken}`);
    });

    it('should use refreshed token after expiry (simulating token refresh)', async () => {
      const expiredToken = 'expired-token';
      const refreshedToken = 'refreshed-token-xyz789';

      mockGetAccessToken(oauthService)
        .mockResolvedValueOnce(expiredToken)
        .mockResolvedValueOnce(refreshedToken);

      mockHttpPost(httpService).mockReturnValue(
        of(axiosResponse(STUB_UPS_RATE_RESPONSE_SINGLE))
      );

      await callGetShippingRates(rateService, UNIFIED_RATE_REQUEST_WITH_SERVICE);
      const [, , config1] = mockHttpPost(httpService).mock.calls[0];
      expect(config1.headers.Authorization).toBe(`Bearer ${expiredToken}`);

      await callGetShippingRates(rateService, UNIFIED_RATE_REQUEST_WITH_SERVICE);
      const [, , config2] = mockHttpPost(httpService).mock.calls[1];
      expect(config2.headers.Authorization).toBe(`Bearer ${refreshedToken}`);
    });
  });

  // ─── Error Handling ────────────────────────────

  describe('Error Handling', () => {
    it('should throw BadRequestException on 400 response', async () => {
      mockHttpPost(httpService).mockReturnValue(
        throwError(() => axiosError(400, STUB_UPS_ERROR_400))
      );

      await expect(
        callGetShippingRates(rateService, UNIFIED_RATE_REQUEST_WITH_SERVICE)
      ).rejects.toThrow('Invalid request');
    });

    it('should throw UnauthorizedException on 401 response', async () => {
      mockHttpPost(httpService).mockReturnValue(
        throwError(() => axiosError(401, STUB_UPS_ERROR_401))
      );

      await expect(
        callGetShippingRates(rateService, UNIFIED_RATE_REQUEST_WITH_SERVICE)
      ).rejects.toThrow('Unauthorized request');
    });

    it('should throw ForbiddenException on 403 response', async () => {
      mockHttpPost(httpService).mockReturnValue(
        throwError(() => axiosError(403, { message: 'Forbidden' }))
      );

      await expect(
        callGetShippingRates(rateService, UNIFIED_RATE_REQUEST_WITH_SERVICE)
      ).rejects.toThrow('Blocked merchant');
    });

    it('should throw HttpException with TOO_MANY_REQUESTS on 429 response', async () => {
      mockHttpPost(httpService).mockReturnValue(
        throwError(() => axiosError(429, { message: 'Rate limit exceeded' }))
      );

      await expect(
        callGetShippingRates(rateService, UNIFIED_RATE_REQUEST_WITH_SERVICE)
      ).rejects.toThrow('Rate limit exceeded');
    });

    it('should re-throw non-Axios errors as-is', async () => {
      mockHttpPost(httpService).mockReturnValue(
        throwError(() => new Error('Network exploded'))
      );

      await expect(
        callGetShippingRates(rateService, UNIFIED_RATE_REQUEST_WITH_SERVICE)
      ).rejects.toThrow('Network exploded');
    });

    it('should re-throw AxiosError with unmapped status code (e.g. 500)', async () => {
      mockHttpPost(httpService).mockReturnValue(
        throwError(() => axiosError(500, { message: 'Internal Server Error' }))
      );

      await expect(
        callGetShippingRates(rateService, UNIFIED_RATE_REQUEST_WITH_SERVICE)
      ).rejects.toBeInstanceOf(AxiosError);
    });

    it('should handle timeout errors (AxiosError without response)', async () => {
      const timeoutError = new AxiosError(
        'timeout of 5000ms exceeded',
        AxiosError.ECONNABORTED
      );

      mockHttpPost(httpService).mockReturnValue(
        throwError(() => timeoutError)
      );

      await expect(
        callGetShippingRates(rateService, UNIFIED_RATE_REQUEST_WITH_SERVICE)
      ).rejects.toThrow('timeout of 5000ms exceeded');
    });
  });
});
