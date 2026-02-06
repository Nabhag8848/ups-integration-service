import { Module } from '@nestjs/common';
import { UPSModule } from './ups/ups.module';

@Module({
  imports: [UPSModule],
  exports: [UPSModule],
})
export class IntegrationModule {}
