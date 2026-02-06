import { AbstractOAuthService } from '@/modules/api/oauth/services/abstract-oauth.service';
import { UPSOAuthResponseDto } from '@/modules/integration/ups/dtos';
import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

export class UPSOAuthService
  extends AbstractOAuthService<UPSOAuthResponseDto>
  implements OnModuleInit
{
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    super();
  }

  readonly name = 'ups';
  private clientId: string;
  private clientSecret: string;
  private clientCredentialsEndpoint: string;
  private merchantId: string;

  async onModuleInit() {
    const clientId = this.configService.get('UPS_CLIENT_ID');
    const clientSecret = this.configService.get('UPS_CLIENT_SECRET');
    const clientCredentialsEndpoint = this.configService.get(
      'UPS_CLIENT_CREDENTIALS_ENDPOINT'
    );
    const merchantId = this.configService.get('UPS_MERCHANT_ID');

    if (!clientCredentialsEndpoint) {
      throw new Error('UPS_CLIENT_CREDENTIALS_ENDPOINT must be set');
    }

    if (!merchantId) {
      throw new Error('UPS_MERCHANT_ID must be set');
    }

    if (!clientId || !clientSecret) {
      throw new Error('UPS_CLIENT_ID and UPS_CLIENT_SECRET must be set');
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
    throw new Error('Method not implemented.');
  }

  protected async getAccessToken(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  protected async setAccessTokenWithExpiry(
    refreshToken: string,
    expiry: Date
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
