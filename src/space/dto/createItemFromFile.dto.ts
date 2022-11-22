import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { CategoryApiProperty } from '../../docs/properties/categoryApiProperty.decorator';
import { MetadataApiProperty } from '../../docs/properties/metadataApiProperty.decorator';
import { SourceApiProperty } from '../../docs/properties/sourceApiProperty.decorator';
import { FileExtension } from '../enum/fileExtension.enum';

export class CreateItemFromFileDto {
  @CategoryApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @SourceApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly source: string;

  @ApiProperty({
    description: 'Name of the file',
  })
  @IsString()
  @IsNotEmpty()
  readonly filename: string;

  @ApiProperty({
    enum: FileExtension,
    description: 'Type / extension of the file',
  })
  @IsEnum(FileExtension)
  @IsNotEmpty()
  readonly fileExtension: FileExtension;

  @ApiProperty({
    description: 'Base64 string of the file content',
  })
  @IsString()
  @IsNotEmpty()
  readonly file: string;

  @MetadataApiProperty()
  readonly metadata: any;
}
