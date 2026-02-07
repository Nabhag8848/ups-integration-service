import { IsIn, IsNumber, IsString } from 'class-validator';

export class DimensionsDto {
  @IsString()
  @IsIn(['IN', 'CM'])
  unitOfMeasurement: string;

  @IsNumber()
  length: number;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;
}
