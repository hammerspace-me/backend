import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateItemDto } from './createItem.dto';

export class CreateSpaceDto {
  @ApiProperty({
    description: 'Ethereum address of the owner of the space',
  })
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  @IsNotEmpty()
  readonly owner: string;

  @ApiProperty({
    type: () => CreateItemDto,
    description:
      'Initial set of items that will be populated into the new space',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemDto)
  readonly items: CreateItemDto[];
}
