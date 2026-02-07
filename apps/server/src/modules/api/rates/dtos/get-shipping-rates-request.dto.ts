import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { PackageDto } from './package.dto';
import { RateServiceDto } from './rate-service.dto';

export class GetShippingRatesRequestDto {
  @ApiProperty({ type: AddressDto })
  @IsDefined()
  @ValidateNested()
  @Type(() => AddressDto)
  origin: AddressDto;

  @ApiProperty({ type: AddressDto })
  @IsDefined()
  @ValidateNested()
  @Type(() => AddressDto)
  destination: AddressDto;

  @ApiProperty({ type: [PackageDto] })
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PackageDto)
  package: PackageDto[];

  @ApiPropertyOptional({ type: RateServiceDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => RateServiceDto)
  service?: RateServiceDto;
}
