import { BackpackService } from 'src/backpack/service/backpack.service';
import { CreateTokenDto } from '../dto/createToken.dto';
import { TokenDto } from '../dto/token.dto';
import { OAuthService } from '../service/oAuth.service';
import { CreateTokenStrategy } from './createToken.strategy';

export class CreateTokenByRefreshStrategy implements CreateTokenStrategy {
  private readonly oAuthService: OAuthService;
  private readonly backpackService: BackpackService;

  constructor(oAuthService: OAuthService, backpackService: BackpackService) {
    this.oAuthService = oAuthService;
    this.backpackService = backpackService;
  }

  public async createToken(
    createTokenDto: CreateTokenDto,
    tokenType: string,
    expiresIn: number,
  ): Promise<TokenDto> {
    await this.oAuthService.verifyClientIdAndSecret(
      createTokenDto.clientId,
      createTokenDto.clientSecret,
    );

    const refreshTokenPayload =
      this.oAuthService.validateRefreshTokenAndExtractPayload(
        createTokenDto.refreshToken,
      );

    const backpack = await this.backpackService.findBackpackByOwner(
      refreshTokenPayload.sub,
    );

    const accessToken = this.oAuthService.createAccessToken(
      refreshTokenPayload.sub,
      backpack.id,
      refreshTokenPayload.scopes.split(' '),
    );

    const refreshToken = this.oAuthService.createRefreshToken(
      refreshTokenPayload.sub,
      backpack.id,
      refreshTokenPayload.scopes.split(' '),
    );

    return new TokenDto(tokenType, accessToken, expiresIn, refreshToken);
  }
}
