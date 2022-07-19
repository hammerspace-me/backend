import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsNotEmpty, IsString, Length } from 'class-validator';

import { Scopes } from '~/enum/scopes.enum';

export class GetWebAuthorizationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty()
  @IsString()
  @Length(4, 64)
  state?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  responseType: 'token' | 'code';

  @ApiProperty()
  @ArrayUnique({
    message: 'You have duplicate scopes in your request',
  })
  @IsString({
    each: true,
  })
  scopes: Scopes[];
}

export class GetNativeAuthorizationDto {
  @ApiProperty()
  @IsString()
  @Length(4, 16)
  @IsNotEmpty()
  activationCode: string;
}
