import { AddressDto } from '@/modules/api/rates/dtos';

export function mapAddress(address: AddressDto) {
  return {
    AddressLine: address.addressLines,
    City: address.city,
    StateProvinceCode: address.stateProvinceCode,
    PostalCode: address.postalCode,
    CountryCode: address.countryCode,
  };
}
