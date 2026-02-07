import { AbstractOAuthService } from '@/modules/api/oauth/services/abstract-oauth.service';
import { UPSOAuthResponseDto } from '@/modules/integration/ups/dtos';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
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
    const clientId = this.configService.getOrThrow<string>('UPS_CLIENT_ID');
    const clientSecret =
      this.configService.getOrThrow<string>('UPS_CLIENT_SECRET');
    const clientCredentialsEndpoint = this.configService.getOrThrow<string>(
      'UPS_CLIENT_CREDENTIALS_ENDPOINT'
    );
    const merchantId = this.configService.getOrThrow<string | undefined>(
      'UPS_MERCHANT_ID'
    );

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

    try {
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
