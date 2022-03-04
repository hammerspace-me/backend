import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBackpackItemDto {
  @ApiProperty()
  @IsString()
  readonly category: string;

  @ApiProperty()
  @IsString()
  readonly source: string;

  @ApiProperty()
  @IsString()
  readonly content: string;
}
