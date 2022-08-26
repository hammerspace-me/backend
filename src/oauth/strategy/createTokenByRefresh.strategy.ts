import { BackpackService } from 'src/backpack/service/backpack.service';
import { CreateTokenDto } from '../dto/createToken.dto';
import { TokenResponseDto } from '../dto/tokenResponse.dto';
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
  ): Promise<TokenResponseDto> {
    await this.oAuthService.verifyClientIdAndSecret(
      createTokenDto.client_id,
      createTokenDto.client_secret,
    );

    const refreshTokenPayload =
      this.oAuthService.validateRefreshTokenAndExtractPayload(
        createTokenDto.refresh_token,
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

    return new TokenResponseDto(
      tokenType,
      accessToken,
      expiresIn,
      refreshToken,
    );
  }
}
