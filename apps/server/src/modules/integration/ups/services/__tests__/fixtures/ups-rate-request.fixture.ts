import { GetShippingRatesRequestDto } from '../../../../../api/rates/dtos';
import { ShippingServiceCode } from '../../../../../api/rates/enum';

/**
 * This is what YOUR app receives from the user/client.
 * It uses your internal domain models (AddressDto, DimensionsDto, etc.)
 * The @TransformRequestPayload decorator converts this into UPS format.
 */
export const UNIFIED_RATE_REQUEST_WITH_SERVICE: GetShippingRatesRequestDto = {
  origin: {
    addressLines: ['100 Commerce Blvd', 'Suite 200'],
    city: 'TIMONIUM',
    stateProvinceCode: 'MD',
    postalCode: '21093',
    countryCode: 'US',
  },
  destination: {
    addressLines: ['742 Evergreen Terrace'],
    city: 'Alpharetta',
    stateProvinceCode: 'GA',
    postalCode: '30005',
    countryCode: 'US',
  },
  service: { type: ShippingServiceCode.GROUND },
  package: [
    {
      dimensions: { unitOfMeasurement: 'IN', length: 10, width: 8, height: 6 },
      weight: { unitOfMeasurement: 'LBS', weight: 5 },
    },
  ],
};

export const UNIFIED_RATE_REQUEST_WITHOUT_SERVICE: Omit<GetShippingRatesRequestDto, 'service'> = {
  origin: UNIFIED_RATE_REQUEST_WITH_SERVICE.origin,
  destination: UNIFIED_RATE_REQUEST_WITH_SERVICE.destination,
  package: UNIFIED_RATE_REQUEST_WITH_SERVICE.package,
};
