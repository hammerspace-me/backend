import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export default class GetActivationCodeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(4, 16)
  code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  responseType: 'code' | 'token';
}
