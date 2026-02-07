import { IsIn, IsNumber, IsString } from 'class-validator';

export class WeightDto {
  @IsString()
  @IsIn(['LBS', 'KGS', 'OZS'])
  unitOfMeasurement: string;

  @IsNumber()
  weight: number;
}
