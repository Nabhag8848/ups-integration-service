import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DimensionsDto } from './dimensions.dto';
import { WeightDto } from './weight.dto';

export class PackageDto {
  @ApiProperty({ type: DimensionsDto })
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensions: DimensionsDto;

  @ApiProperty({ type: WeightDto })
  @ValidateNested()
  @Type(() => WeightDto)
  weight: WeightDto;
}
