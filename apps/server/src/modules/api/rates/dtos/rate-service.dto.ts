import { IsEnum } from 'class-validator';
import { ShippingServiceCode } from '@/modules/api/rates/enum';

export class RateServiceDto {
  @IsEnum(ShippingServiceCode)
  code: ShippingServiceCode;
}
