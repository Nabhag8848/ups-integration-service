import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ShippingServiceCode } from '@/modules/api/rates/enum';

export class RateServiceDto {
  @ApiProperty({ enum: ShippingServiceCode, example: ShippingServiceCode.GROUND })
  @IsEnum(ShippingServiceCode)
  type: ShippingServiceCode;
}
