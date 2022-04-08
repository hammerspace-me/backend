import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  @IsNotEmpty()
  readonly address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly signature: string;
}
