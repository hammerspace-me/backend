import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CategoryApiProperty } from '../../docs/properties/categoryApiProperty.decorator';
import { MetadataApiProperty } from '../../docs/properties/metadataApiProperty.decorator';
import { SourceApiProperty } from '../../docs/properties/sourceApiProperty.decorator';

export class CreateItemDto {
  @CategoryApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @SourceApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly source: string;

  @ApiProperty({
    description: 'IPFS CID of the underlying asset',
  })
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @MetadataApiProperty()
  readonly metadata: any;
}
