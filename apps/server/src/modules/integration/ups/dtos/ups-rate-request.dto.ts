import { Expose, Transform } from 'class-transformer';
import { AddressDto } from '@/modules/api/rates/dtos';

const DIMENSION_UNIT_DESCRIPTIONS: Record<string, string> = {
  IN: 'Inches',
  CM: 'Centimeters',
};

const WEIGHT_UNIT_DESCRIPTIONS: Record<string, string> = {
  LBS: 'Pounds',
  KGS: 'Kilograms',
  OZS: 'Ounces',
};

function mapAddress(address: AddressDto) {
  return {
    AddressLine: address.addressLines,
    City: address.city,
    StateProvinceCode: address.stateProvinceCode,
    PostalCode: address.postalCode,
    CountryCode: address.countryCode,
  };
}

export class UPSRateRequestDto {
  @Expose({ name: 'Shipper' })
  @Transform(({ obj }) => ({ Address: mapAddress(obj.origin) }), { toClassOnly: true })
  shipper: { Address: Record<string, unknown> };

  @Expose({ name: 'ShipFrom' })
  @Transform(({ obj }) => ({ Address: mapAddress(obj.origin) }), { toClassOnly: true })
  shipFrom: { Address: Record<string, unknown> };

  @Expose({ name: 'ShipTo' })
  @Transform(({ obj }) => ({ Address: mapAddress(obj.destination) }), { toClassOnly: true })
  shipTo: { Address: Record<string, unknown> };

  @Expose({ name: 'Service' })
  @Transform(({ obj }) =>
    obj.service ? { Code: obj.service.code } : undefined,
    { toClassOnly: true }
  )
  service?: { Code: string };

  @Expose({ name: 'Package' })
  @Transform(({ obj }) => [
    {
      PackagingType: {
        Code: obj.package.packagingType.code,
      },
      Dimensions: {
        UnitOfMeasurement: {
          Code: obj.package.dimensions.unitOfMeasurement,
          Description:
            DIMENSION_UNIT_DESCRIPTIONS[
              obj.package.dimensions.unitOfMeasurement
            ],
        },
        Length: String(obj.package.dimensions.length),
        Width: String(obj.package.dimensions.width),
        Height: String(obj.package.dimensions.height),
      },
      PackageWeight: {
        UnitOfMeasurement: {
          Code: obj.package.weight.unitOfMeasurement,
          Description:
            WEIGHT_UNIT_DESCRIPTIONS[obj.package.weight.unitOfMeasurement],
        },
        Weight: String(obj.package.weight.weight),
      },
    },
  ], { toClassOnly: true })
  package: Record<string, unknown>[];
}
