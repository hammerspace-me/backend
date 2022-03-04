import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { CreateBackpackItemDto } from './createBackpackItem.dto';

export class CreateBackpackDto {
  @ApiProperty()
  @IsString()
  readonly id: string;

  @ApiProperty({ type: () => CreateBackpackItemDto })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBackpackItemDto)
  readonly backpackItems: CreateBackpackItemDto[];
}
