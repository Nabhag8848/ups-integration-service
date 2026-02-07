import { IsDefined, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { PackageDto } from './package.dto';
import { ServiceDto } from './service.dto';

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
  @ValidateNested()
  @Type(() => PackageDto)
  package: PackageDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ServiceDto)
  service?: ServiceDto;
}
