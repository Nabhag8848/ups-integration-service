import { Global, Module } from '@nestjs/common';
import { OAuthRegistryService } from './registry/oauth.registry';
import { RedisModule } from '@/database/redis/redis.module';

@Global()
@Module({
  imports: [RedisModule],
  providers: [OAuthRegistryService],
  exports: [OAuthRegistryService],
})
export class OAuthModule {}
