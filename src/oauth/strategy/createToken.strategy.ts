import { CreateTokenDto } from '../dto/createToken.dto';
import { TokenDto } from '../dto/token.dto';

export interface CreateTokenStrategy {
  createToken(
    createToken: CreateTokenDto,
    tokenType: string,
    expiresIn: number,
  ): Promise<TokenDto>;
}
