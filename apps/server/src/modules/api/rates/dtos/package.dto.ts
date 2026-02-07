import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DimensionsDto } from './dimensions.dto';
import { WeightDto } from './weight.dto';

export class PackageDto {
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensions: DimensionsDto;

  @ValidateNested()
  @Type(() => WeightDto)
  weight: WeightDto;
}
