import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class AddressDto {
  @ApiProperty({ type: [String], example: ['100 Main St'] })
  @IsArray()
  @IsString({ each: true })
  addressLines: string[];

  @ApiProperty({ example: 'Atlanta' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'GA' })
  @IsString()
  stateProvinceCode: string;

  @ApiPropertyOptional({ example: '30301' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ example: 'US' })
  @IsString()
  countryCode: string;
}
