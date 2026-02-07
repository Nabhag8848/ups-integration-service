import { ShippingServiceCode } from "@/modules/api/rates/enum";

export const UNIFIED_TO_UPS_SERVICE_CODE: Record<ShippingServiceCode, string> = {
  [ShippingServiceCode.NEXT_DAY_AIR]: '01',
  [ShippingServiceCode.SECOND_DAY_AIR]: '02',
  [ShippingServiceCode.GROUND]: '03',
  [ShippingServiceCode.WORLDWIDE_EXPRESS]: '07',
  [ShippingServiceCode.WORLDWIDE_EXPEDITED]: '08',
  [ShippingServiceCode.STANDARD_INTERNATIONAL]: '11',
  [ShippingServiceCode.THREE_DAY_SELECT]: '12',
  [ShippingServiceCode.NEXT_DAY_AIR_SAVER]: '13',
  [ShippingServiceCode.NEXT_DAY_AIR_EARLY]: '14',
  [ShippingServiceCode.WORLDWIDE_EXPRESS_PLUS]: '54',
  [ShippingServiceCode.SECOND_DAY_AIR_AM]: '59',
  [ShippingServiceCode.WORLDWIDE_SAVER]: '65',
  [ShippingServiceCode.WORLDWIDE_EXPRESS_FREIGHT_MIDDAY]: '71',
  [ShippingServiceCode.HEAVY_GOODS]: '75',
  [ShippingServiceCode.WORLDWIDE_EXPRESS_FREIGHT]: '96',
};

export const UPS_TO_UNIFIED_SERVICE_CODE: Record<string, ShippingServiceCode> = Object.fromEntries(
  Object.entries(UNIFIED_TO_UPS_SERVICE_CODE).map(([k, v]) => [v, k as ShippingServiceCode]),
) as Record<string, ShippingServiceCode>;
