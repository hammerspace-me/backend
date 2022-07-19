import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

class CreateTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientSecret: string;
}

export class CreateTokenUsingRefreshDto extends CreateTokenDto {
  refreshToken: string;
}

export class CreateTokenUsingAuthorizationCodeDto extends CreateTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsString()
  @Length(4, 64)
  state?: string;
}
