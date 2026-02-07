import { IsDefined, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { PackageDto } from './package.dto';
import { RateServiceDto } from './rate-service.dto';

export class GetShippingRatesRequestDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => AddressDto)
  origin: AddressDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => AddressDto)
  destination: AddressDto;

  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PackageDto)
  packages: PackageDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => RateServiceDto)
  service?: RateServiceDto;
}
