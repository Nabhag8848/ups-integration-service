import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CarrierEntity } from '@/database/entities/integration';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from '@/database/redis/redis.service';
import { UpsertCarrierDto } from '@/modules/carrier/dtos';

@Injectable()
export class CarrierService {
  private readonly REFRESH_BUFFER_SECONDS = 120;

  constructor(
    @InjectRepository(CarrierEntity)
    private readonly carrierRepository: Repository<CarrierEntity>,
    private readonly redisService: RedisService
  ) {}

  async getAccessTokenByProviderAndClientId(
    provider: string,
    clientId: string
  ): Promise<string | undefined> {
    const carrier = await this.carrierRepository.findOne({
      where: {
        provider,
        clientId,
      },
      select: {
        accessToken: true,
      },
    });

    return carrier?.accessToken;
  }

  async getCachedAccessTokenByProviderAndClientId(
    provider: string,
    clientId: string
  ): Promise<string | null> {
    const key = `carrier:access_token:${provider}:${clientId}`;
    const client = await this.redisService.getClient();

    const accessToken = await client.get(key);
    return accessToken;
  }

  async upsertCarrier(carrier: UpsertCarrierDto): Promise<void> {
    await this.carrierRepository.upsert(carrier, {
      conflictPaths: ['provider', 'clientId'],
      skipUpdateIfNoValuesChanged: true,
    });
  }

  async setCachedAccessTokenWithExpiry(carrier: UpsertCarrierDto): Promise<void> {
    const { provider, clientId, accessToken, accessTokenExpiresAt } = carrier;

    const key = `carrier:access_token:${provider}:${clientId}`;
    const redisClient = await this.redisService.getClient();
    // Calculate time until expiration in milliseconds
    const now = Date.now();
    const expiresAt = accessTokenExpiresAt.getTime();
    const timeUntilExpiryMs = expiresAt - now;

    // Convert to seconds and subtract buffer (2 minutes before actual expiration)
    const timeUntilExpirySeconds = Math.floor(timeUntilExpiryMs / 1000);
    const ttlWithBuffer = timeUntilExpirySeconds - this.REFRESH_BUFFER_SECONDS;

    await redisClient.setex(key, ttlWithBuffer, accessToken);
  }
}
