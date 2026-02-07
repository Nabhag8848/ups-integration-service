import { Module } from '@nestjs/common';
import { OAuthModule } from './oauth/oauth.module';
import { RatesModule } from './rates/rates.module';

@Module({
  imports: [OAuthModule, RatesModule],
  exports: [OAuthModule, RatesModule],
})
export class ApiModule {}
