import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { RateServiceDto } from './rate-service.dto';

class ChargesDto {
  @ApiProperty({ example: 'USD' })
  @Expose()
  @IsString()
  currencyCode: string;

  @ApiProperty({ example: 12.5 })
  @Expose()
  @IsNumber()
  monetaryValue: number;
}

class RateQuoteDto {
  @ApiProperty({ type: ChargesDto })
  @Expose()
  @ValidateNested()
  @Type(() => ChargesDto)
  totalCharges: ChargesDto;

  @ApiProperty({ type: ChargesDto })
  @Expose()
  @ValidateNested()
  @Type(() => ChargesDto)
  transportationCharges: ChargesDto;

  @ApiProperty({ type: RateServiceDto })
  @Expose()
  @ValidateNested()
  @Type(() => RateServiceDto)
  service: RateServiceDto;
}

export class RateQuotesResponseDto {
  @ApiProperty({ type: [RateQuoteDto] })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => RateQuoteDto)
  quotes: RateQuoteDto[];
}
