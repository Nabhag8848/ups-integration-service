import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { PackageDto } from './package.dto';
import { RateServiceDto } from './rate-service.dto';

export class GetShippingRatesRequestDto {
  @ApiProperty({ type: AddressDto, description: 'Origin address.' })
  @IsDefined()
  @ValidateNested()
  @Type(() => AddressDto)
  origin: AddressDto;

  @ApiProperty({ type: AddressDto, description: 'Destination address.' })
  @IsDefined()
  @ValidateNested()
  @Type(() => AddressDto)
  destination: AddressDto;

  @ApiProperty({
    type: [PackageDto],
    description: 'One or more packages to be rated.',
  })
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PackageDto)
  package: PackageDto[];

  @ApiPropertyOptional({
    type: RateServiceDto,
    description:
      'Optional specific service to rate. If omitted, carrier can return multiple service quotes.',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RateServiceDto)
  service?: RateServiceDto;
}
