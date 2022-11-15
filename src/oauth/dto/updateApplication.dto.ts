import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Environment } from '../enum/environment.enum';

export class UpdateApplicationDto {
  @ApiProperty({
    description: 'Logo url',
  })
  @IsString()
  @IsOptional()
  readonly logo?: string;

  @ApiProperty({
    description: 'Banner url',
  })
  @IsString()
  @IsOptional()
  readonly banner?: string;

  @ApiProperty({
    description: 'Default redirectUri',
  })
  @IsString()
  @IsOptional()
  readonly redirectUri?: string;

  @ApiProperty({
    description: 'Environment',
  })
  @IsEnum(Environment)
  @IsOptional()
  readonly environment?: Environment;

  @ApiProperty({
    description: 'Client secret',
  })
  @IsString()
  readonly clientSecret: string;
}
