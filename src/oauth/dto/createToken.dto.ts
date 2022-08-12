import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { GrantType } from '../enum/grantType.enum';

export class CreateTokenDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientSecret: string;

  @ApiProperty()
  @IsEnum(GrantType)
  grantType: GrantType;

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
  refreshToken: string;
}
