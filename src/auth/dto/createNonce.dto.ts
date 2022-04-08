import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNonceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  readonly backpack: string;

  // Currently a number, but might be a (more complex) string in the future
  @IsString()
  readonly nonce: string = `${Math.floor(100000 + Math.random() * 900000)}`;
}
