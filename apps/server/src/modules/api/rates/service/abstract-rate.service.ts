export abstract class AbstractRateService<T, R> {
  abstract readonly name: string;

  abstract getShippingRates(request: T): Promise<R>;
}
