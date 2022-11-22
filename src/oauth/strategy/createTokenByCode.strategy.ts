import { SpaceService } from 'src/space/service/space.service';
import { CreateTokenDto } from '../dto/createToken.dto';
import { TokenResponseDto } from '../dto/tokenResponse.dto';
import { OAuthService } from '../service/oAuth.service';
import { CreateTokenStrategy } from './createToken.strategy';

export class CreateTokenByCodeStrategy implements CreateTokenStrategy {
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

    const authorizationRequest =
      await this.oAuthService.findAuthorizationRequestByAuthorizationCode(
        createTokenDto.code,
      );

    await this.oAuthService.validateAuthorizationRequest(authorizationRequest);
    //this.oAuthService.verifyState(authorizationRequest, createTokenDto.state);

    const invalidatedAuthorizationRequest =
      await this.oAuthService.invalidateAuthorizationRequest(
        authorizationRequest,
      );

    const owner = invalidatedAuthorizationRequest.owner;
    const space = await this.spaceService.findSpaceByOwner(owner);

    const accessToken = this.oAuthService.createAccessToken(
      owner,
      space.id,
      invalidatedAuthorizationRequest.scopes,
    );

    const refreshToken = this.oAuthService.createRefreshToken(
      owner,
      space.id,
      invalidatedAuthorizationRequest.scopes,
    );

    return new TokenResponseDto(
      tokenType,
      accessToken,
      expiresIn,
      refreshToken,
    );
  }
}
