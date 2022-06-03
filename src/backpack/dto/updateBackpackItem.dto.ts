import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBackpackItemDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly category: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly source: string;

  @ApiProperty()
  @IsOptional()
  readonly metadata: any;
}
