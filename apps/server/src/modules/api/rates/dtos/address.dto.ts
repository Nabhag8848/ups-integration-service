import { IsArray, IsOptional, IsString } from 'class-validator';

export class AddressDto {
  @IsArray()
  @IsString({ each: true })
  addressLines: string[];

  @IsString()
  city: string;

  @IsString()
  stateProvinceCode: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsString()
  countryCode: string;
}
