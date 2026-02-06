import { IsString } from 'class-validator';

export class UPSOAuthResponseDto {
  @IsString()
  token_type: string;

  @IsString()
  issued_at: string;

  @IsString()
  client_id: string;

  @IsString()
  access_token: string;

  @IsString()
  scope: string;

  @IsString()
  expires_in: string;

  @IsString()
  refresh_count: string;

  @IsString()
  status: string;
}
