import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsString } from 'class-validator';

export class WeightDto {
  @ApiProperty({ enum: ['LBS', 'KGS', 'OZS'], example: 'LBS' })
  @IsString()
  @IsIn(['LBS', 'KGS', 'OZS'])
  unitOfMeasurement: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  weight: number;
}
