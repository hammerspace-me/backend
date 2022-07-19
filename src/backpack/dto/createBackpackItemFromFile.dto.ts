import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

import { FileExtension } from '../enum/fileExtension.enum';

export class CreateBackpackItemFromFileDto {
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
  readonly filename: string;

  @ApiProperty({
    enum: FileExtension,
  })
  @IsEnum(FileExtension)
  @IsNotEmpty()
  readonly fileExtension: FileExtension;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly file: string;

  @ApiProperty()
  readonly metadata: any;
}
