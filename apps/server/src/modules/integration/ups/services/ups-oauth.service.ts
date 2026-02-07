import { AbstractOAuthService } from '@/modules/api/oauth/services/abstract-oauth.service';
import { UPSOAuthResponseDto } from '@/modules/integration/ups/dtos';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CarrierService } from '@/modules/carrier/service/carrier.service';
import { calculateExpirationDate } from '@/utils';
import { RedisService } from '@/database/redis/redis.service';

@Injectable()
export class UPSOAuthService
  extends AbstractOAuthService<UPSOAuthResponseDto>
  implements OnModuleInit
{
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly carrierService: CarrierService,
    private readonly redisService: RedisService
  ) {
    super();
  }

  readonly name = 'ups';
  private clientId: string;
  private clientSecret: string;
  private clientCredentialsEndpoint: string;
  private merchantId: string;

  async onModuleInit() {
    const clientId = this.configService.get<string | undefined>(
      'UPS_CLIENT_ID'
    );
    const clientSecret = this.configService.get<string | undefined>(
      'UPS_CLIENT_SECRET'
    );
    const clientCredentialsEndpoint = this.configService.get<
      string | undefined
    >('UPS_CLIENT_CREDENTIALS_ENDPOINT');
    const merchantId = this.configService.get<string | undefined>(
      'UPS_MERCHANT_ID'
    );

    if (!clientId || !clientSecret) {
      throw new Error('UPS_CLIENT_ID and UPS_CLIENT_SECRET must be set');
    }

    if (!clientCredentialsEndpoint) {
      throw new Error('UPS_CLIENT_CREDENTIALS_ENDPOINT must be set');
    }

    if (!merchantId) {
      throw new Error('UPS_MERCHANT_ID must be set');
    }

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.clientCredentialsEndpoint = clientCredentialsEndpoint;
    this.merchantId = merchantId;
    await this.listenForTokenExpiry();
  }

  protected async getClientCredentialsEndpoint(): Promise<string> {
    return this.clientCredentialsEndpoint;
  }

  protected async exchangeCredentialsForToken(): Promise<UPSOAuthResponseDto> {
    const credentials = Buffer.from(
      `${this.clientId}:${this.clientSecret}`
    ).toString('base64');

    const Authorization = `Basic ${credentials}`;

    const formData = new URLSearchParams({
      grant_type: 'client_credentials',
    });

    const response = await firstValueFrom(
      this.httpService.post<UPSOAuthResponseDto>(
        this.clientCredentialsEndpoint,
        formData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
            'x-merchant-id': this.merchantId,
            Authorization,
          },
        }
      )
    );

    return response.data;
  }

  protected async listenForTokenExpiry(): Promise<void> {
    const subscriber = this.redisService.getSubscriber();

    await subscriber.psubscribe(
      `__keyspace@0__:carrier:access_token:${this.name}:*`
    );

    subscriber.on('pmessage', async () => {
      const provider = this.name;
      const {
        access_token: accessToken,
        expires_in: accessTokenExpiresIn,
        client_id: clientId,
      } = await this.exchangeCredentialsForToken();

      const accessTokenExpiresAt = calculateExpirationDate(
        Number(accessTokenExpiresIn)
      );

      const carrier = {
        provider,
        clientId,
        accessToken,
        accessTokenExpiresAt,
      };

      await Promise.all([
        this.carrierService.upsertCarrier(carrier),
        this.carrierService.setCachedAccessTokenWithExpiry(carrier),
      ]);
    });
  }

  async getAccessToken(): Promise<string> {
    const provider = this.name;
    const clientId = this.clientId;

    const cachedAccessToken =
      await this.carrierService.getCachedAccessTokenByProviderAndClientId(
        provider,
        clientId
      );

    if (cachedAccessToken) {
      return cachedAccessToken;
    }

    const { access_token: accessToken, expires_in: accessTokenExpiresIn } =
      await this.exchangeCredentialsForToken();

    const accessTokenExpiresAt = calculateExpirationDate(
      Number(accessTokenExpiresIn)
    );

    const carrier = {
      provider,
      clientId,
      accessToken,
      accessTokenExpiresAt,
    };

    await Promise.all([
      this.carrierService.upsertCarrier(carrier),
      this.carrierService.setCachedAccessTokenWithExpiry(carrier),
    ]);

    return accessToken;
  }
}
