import { Expose, Transform } from 'class-transformer';
import {
  UNIFIED_TO_UPS_SERVICE_CODE,
  DIMENSION_UNIT_DESCRIPTIONS,
  WEIGHT_UNIT_DESCRIPTIONS,
  mapAddress,
} from '@/modules/integration/ups/maps';
import { ShippingServiceCode } from '@/modules/api/rates/enum';

export class UPSRateRequestDto {
  @Expose({ name: 'Shipper' })
  @Transform(({ obj }) => ({ Address: mapAddress(obj.origin) }), {
    toClassOnly: true,
  })
  shipper: { Address: Record<string, unknown> };

  @Expose({ name: 'ShipFrom' })
  @Transform(({ obj }) => ({ Address: mapAddress(obj.origin) }), {
    toClassOnly: true,
  })
  shipFrom: { Address: Record<string, unknown> };

  @Expose({ name: 'ShipTo' })
  @Transform(({ obj }) => ({ Address: mapAddress(obj.destination) }), {
    toClassOnly: true,
  })
  shipTo: { Address: Record<string, unknown> };

  @Expose({ name: 'Service' })
  @Transform(
    ({ obj }) =>
      obj.service
        ? {
            Code: UNIFIED_TO_UPS_SERVICE_CODE[
              obj.service.code as ShippingServiceCode
            ],
          }
        : undefined,
    { toClassOnly: true }
  )
  service?: { Code: string };

  @Expose({ name: 'Package' })
  @Transform(
    ({ obj }) =>
      obj.package.map((pkg: Record<string, any>) => ({
        Dimensions: {
          UnitOfMeasurement: {
            Code: pkg.dimensions.unitOfMeasurement,
            Description:
              DIMENSION_UNIT_DESCRIPTIONS[pkg.dimensions.unitOfMeasurement],
          },
          Length: String(pkg.dimensions.length),
          Width: String(pkg.dimensions.width),
          Height: String(pkg.dimensions.height),
        },
        PackageWeight: {
          UnitOfMeasurement: {
            Code: pkg.weight.unitOfMeasurement,
            Description:
              WEIGHT_UNIT_DESCRIPTIONS[pkg.weight.unitOfMeasurement],
          },
          Weight: String(pkg.weight.weight),
        },
      })),
    { toClassOnly: true }
  )
  package: Record<string, unknown>[];
}
