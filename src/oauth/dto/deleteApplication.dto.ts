import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteApplicationDto {
  @ApiProperty({
    description: 'OAuth2 application secret',
  })
  @IsString()
  @IsNotEmpty()
  readonly clientSecret: string;
}
