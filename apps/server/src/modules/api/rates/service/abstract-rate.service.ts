import { RateQuotesResponseDto } from "@/modules/api/rates/dtos";

export abstract class AbstractRateService<T> {
  abstract readonly name: string;

  abstract getShippingRates(request: T): Promise<RateQuotesResponseDto>;
}
