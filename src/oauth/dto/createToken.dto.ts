import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { GrantType } from '../enum/grantType.enum';

export class CreateTokenDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  client_id: string;

  @ApiProperty()
  @IsString()
  client_secret: string;

  @ApiProperty()
  @IsString()
  @IsEnum(GrantType)
  grant_type: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  code: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  state: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  refresh_token: string;
}
