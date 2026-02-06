import { Module, OnModuleInit } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UPSOAuthService } from './services/ups-oauth.service';
import { OAuthRegistryService } from '@/modules/api/oauth/registry/oauth.registry';

@Module({
  imports: [HttpModule],
  providers: [UPSOAuthService],
})
export class UPSModule implements OnModuleInit {
  constructor(
    private readonly OAuthRegistryService: OAuthRegistryService,
    private readonly upsOAuthService: UPSOAuthService
  ) {}

  async onModuleInit() {
    await this.OAuthRegistryService.registerService(this.upsOAuthService);
  }
}
