import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { QueueModule } from './queue/queue.module';
import { IntegrationModule } from './integration/integration.module';

@Module({
  imports: [ApiModule, QueueModule, IntegrationModule],
  exports: [ApiModule, QueueModule, IntegrationModule],
})
export class ModulesModule {}
