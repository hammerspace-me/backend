import { CreateTokenDto } from '../dto/createToken.dto';
import { TokenResponseDto } from '../dto/tokenResponse.dto';

export interface CreateTokenStrategy {
  createToken(
    createToken: CreateTokenDto,
    tokenType: string,
    expiresIn: number,
  ): Promise<TokenResponseDto>;
}
