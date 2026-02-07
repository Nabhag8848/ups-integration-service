import { Injectable } from '@nestjs/common';
import { AbstractRateService } from '@/modules/api/rates/service/abstract-rate.service';

@Injectable()
export class RatesRegistryService {
  private readonly ratesServices: Map<string, AbstractRateService<unknown>> =
    new Map();

  /**
   * Register a rates service for an integration
   */
  registerService(service: AbstractRateService<unknown>): void {
    this.ratesServices.set(service.name, service);
  }

  /**
   * Get a rates service for an integration
   */
  getService(name: string): AbstractRateService<unknown> | undefined {
    return this.ratesServices.get(name);
  }
}
