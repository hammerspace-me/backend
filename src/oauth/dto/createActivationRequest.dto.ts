import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Scopes } from '../enum/scopes.enum';

export default class CreateActivationRequestDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  redirectUri?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty()
  @ArrayUnique({
    message: 'Scopes must be unique',
  })
  @IsEnum(Scopes, {
    each: true,
  })
  scopes: Scopes[];
}
