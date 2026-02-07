import { Expose, Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { RateServiceDto } from './rate-service.dto';

class ChargesDto {
  @Expose()
  @IsString()
  currencyCode: string;

  @Expose()
  @IsNumber()
  monetaryValue: number;
}

class RateQuoteDto {
  @Expose()
  @ValidateNested()
  @Type(() => ChargesDto)
  totalCharges: ChargesDto;

  @Expose()
  @ValidateNested()
  @Type(() => ChargesDto)
  transportationCharges: ChargesDto;

  @Expose()
  @ValidateNested()
  @Type(() => RateServiceDto)
  service: RateServiceDto;
}

export class RateQuotesResponseDto {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => RateQuoteDto)
  quotes: RateQuoteDto[];
}
