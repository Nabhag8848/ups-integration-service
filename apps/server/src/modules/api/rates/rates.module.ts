import { Global, Module } from '@nestjs/common';
import { RatesRegistryService } from './registry/rates.registry';
import { RatesController } from './rates.controller';

@Global()
@Module({
  imports: [],
  providers: [RatesRegistryService],
  exports: [RatesRegistryService],
  controllers: [RatesController],
})
export class RatesModule {}
