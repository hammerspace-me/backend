import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateBackpackItemDto } from './createBackpackItem.dto';

export class CreateBackpackDto {
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  @IsNotEmpty()
  readonly owner: string;

  @ApiProperty({ type: () => CreateBackpackItemDto })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBackpackItemDto)
  readonly backpackItems: CreateBackpackItemDto[];
}
