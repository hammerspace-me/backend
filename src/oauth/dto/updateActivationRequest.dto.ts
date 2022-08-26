import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export default class UpdateActivationRequestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  authorizationCode?: string;
}
