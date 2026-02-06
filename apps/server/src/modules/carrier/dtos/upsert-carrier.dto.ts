import { IsDate, IsString } from 'class-validator';

export class UpsertCarrierDto {
  @IsString()
  provider: string;

  @IsString()
  clientId: string;

  @IsString()
  accessToken: string;

  @IsDate()
  accessTokenExpiresAt: Date;
}
