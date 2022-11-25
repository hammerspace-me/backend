import { SpaceService } from 'src/space/service/space.service';
import { CreateTokenDto } from '../dto/createToken.dto';
import { TokenResponseDto } from '../dto/tokenResponse.dto';
import { OAuthService } from '../service/oAuth.service';
import { CreateTokenStrategy } from './createToken.strategy';

export class CreateTokenByRefreshStrategy implements CreateTokenStrategy {
  private readonly oAuthService: OAuthService;
  private readonly spaceService: SpaceService;

  constructor(oAuthService: OAuthService, spaceService: SpaceService) {
    this.oAuthService = oAuthService;
    this.spaceService = spaceService;
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

    const space = await this.spaceService.findSpaceByOwner(
      refreshTokenPayload.sub,
    );

    const accessToken = this.oAuthService.createAccessToken(
      refreshTokenPayload.sub,
      space.id,
      refreshTokenPayload.scopes.split(' '),
    );

    const refreshToken = this.oAuthService.createRefreshToken(
      refreshTokenPayload.sub,
      space.id,
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
