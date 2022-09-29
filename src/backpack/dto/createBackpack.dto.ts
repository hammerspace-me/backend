import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateBackpackItemDto } from './createBackpackItem.dto';

export class CreateBackpackDto {
  @ApiProperty({
    description: 'Ethereum address of the owner of the backpack',
  })
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  @IsNotEmpty()
  readonly owner: string;

  @ApiProperty({
    type: () => CreateBackpackItemDto,
    description:
      'Initial set of backpack items that will be populated into the new backpack',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBackpackItemDto)
  readonly backpackItems: CreateBackpackItemDto[];
}
