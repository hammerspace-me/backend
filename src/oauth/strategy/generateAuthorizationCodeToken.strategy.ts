import { generateToken } from '../utils/token.utils';
import { GenerateAuthorizationCodeStrategy } from './generateAuthorizationCode.strategy';

export class GenerateAuthorizationCodeTokenStrategy
  implements GenerateAuthorizationCodeStrategy
{
  generateAuthorizationCode(): string {
    return generateToken(32);
  }
}
