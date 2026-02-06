import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarrierEntity } from '@/database/entities/integration';
import { CarrierService } from './service/carrier.service';
import { RedisModule } from '@/database/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([CarrierEntity]), RedisModule],
  providers: [CarrierService],
  exports: [CarrierService],
})
export class CarrierModule {}  