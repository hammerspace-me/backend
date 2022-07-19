import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly message: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly signature: string;
}
