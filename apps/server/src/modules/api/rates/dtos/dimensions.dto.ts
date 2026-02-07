import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsString } from 'class-validator';

export class DimensionsDto {
  @ApiProperty({ enum: ['IN', 'CM'], example: 'IN' })
  @IsString()
  @IsIn(['IN', 'CM'])
  unitOfMeasurement: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  length: number;

  @ApiProperty({ example: 8 })
  @IsNumber()
  width: number;

  @ApiProperty({ example: 6 })
  @IsNumber()
  height: number;
}
