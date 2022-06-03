import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty, IsString } from 'class-validator';

export class CreateBackpackItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly source: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @ApiProperty()
  readonly metadata: any;
}
