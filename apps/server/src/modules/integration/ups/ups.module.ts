import { Module, OnModuleInit } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UPSOAuthService } from './services/ups-oauth.service';
import { UPSRateService } from './services/ups-rate.service';
import { OAuthRegistryService } from '@/modules/api/oauth/registry/oauth.registry';
import { RedisModule } from '@/database/redis/redis.module';
import { CarrierModule } from '@/modules/carrier/carrier.module';
import { RatesRegistryService } from '@/modules/api/rates/registry/rates.registry';

@Module({
  imports: [HttpModule, RedisModule, CarrierModule],
  providers: [UPSOAuthService, UPSRateService],
  exports: [UPSRateService],
})
export class UPSModule implements OnModuleInit {
  constructor(
    private readonly OAuthRegistryService: OAuthRegistryService,
    private readonly upsOAuthService: UPSOAuthService,
    private readonly upsRateService: UPSRateService,
    private readonly ratesRegistryService: RatesRegistryService
  ) {}

  async onModuleInit() {
    await this.OAuthRegistryService.registerService(this.upsOAuthService);
    await this.ratesRegistryService.registerService(this.upsRateService)
  }
}
