import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Environment } from '../enum/environment.enum';

export class CreateApplicationDto {
  @ApiProperty({
    description: 'OAuth2 application name',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'Logo url',
  })
  @IsString()
  @IsNotEmpty()
  readonly logo: string;

  @ApiProperty({
    description: 'Banner url',
  })
  @IsString()
  @IsNotEmpty()
  readonly banner: string;

  @ApiProperty({
    description: 'Default redirectUri',
  })
  @IsString()
  @IsNotEmpty()
  readonly redirectUri: string;

  @ApiProperty({
    description: 'Environment',
  })
  @IsEnum(Environment)
  @IsOptional()
  readonly environment?: Environment;
}
