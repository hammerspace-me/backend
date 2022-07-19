import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsNotEmpty, IsString, Length } from 'class-validator';

import { Scopes } from '~/enum/scopes.enum';

export default class AuthorizeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  responseType: 'code' | 'token';

  @ApiProperty()
  @IsString()
  @Length(4, 64)
  state?: string;

  @ApiProperty()
  @ArrayUnique({
    message: 'You have duplicate scopes in your request',
  })
  @IsString({
    each: true,
  })
  scopes: Scopes[];
}
