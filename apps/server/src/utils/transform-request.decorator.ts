import { plainToInstance, instanceToPlain } from 'class-transformer';

type Constructor<T = unknown> = new (...args: unknown[]) => T;

export function TransformRequestPayload(DtoClass: Constructor) {
  return function (
    _target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      const instance = plainToInstance(DtoClass, args[0]);
      args[0] = instanceToPlain(instance, {
        excludeExtraneousValues: true,
      });
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
