import { IsString } from 'class-validator';

export class ServiceDto {
  @IsString()
  code: string;
}
