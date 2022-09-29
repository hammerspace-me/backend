import { IsOptional, IsString } from 'class-validator';
import { CategoryApiProperty } from '../../docs/properties/categoryApiProperty.decorator';
import { MetadataApiProperty } from '../../docs/properties/metadataApiProperty.decorator';
import { SourceApiProperty } from '../../docs/properties/sourceApiProperty.decorator';

export class UpdateBackpackItemDto {
  @CategoryApiProperty()
  @IsString()
  @IsOptional()
  readonly category: string;

  @SourceApiProperty()
  @IsString()
  @IsOptional()
  readonly source: string;

  @MetadataApiProperty()
  @IsOptional()
  readonly metadata: any;
}
