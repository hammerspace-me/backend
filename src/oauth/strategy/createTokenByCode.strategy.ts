import { BackpackService } from 'src/backpack/service/backpack.service';
import { CreateTokenDto } from '../dto/createToken.dto';
import { TokenResponseDto } from '../dto/tokenResponse.dto';
import { OAuthService } from '../service/oAuth.service';
import { CreateTokenStrategy } from './createToken.strategy';

export class CreateTokenByCodeStrategy implements CreateTokenStrategy {
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
    const backpack = await this.backpackService.findBackpackByOwner(owner);

    const accessToken = this.oAuthService.createAccessToken(
      owner,
      backpack.id,
      invalidatedAuthorizationRequest.scopes,
    );

    const refreshToken = this.oAuthService.createRefreshToken(
      owner,
      backpack.id,
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
