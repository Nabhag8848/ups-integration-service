import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [ApiModule, QueueModule],
  exports: [ApiModule, QueueModule],
})
export class ModulesModule {}
