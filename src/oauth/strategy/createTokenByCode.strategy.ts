import { BackpackService } from 'src/backpack/service/backpack.service';
import { CreateTokenDto } from '../dto/createToken.dto';
import { TokenDto } from '../dto/token.dto';
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
  ): Promise<TokenDto> {
    await this.oAuthService.verifyClientIdAndSecret(
      createTokenDto.clientId,
      createTokenDto.clientSecret,
    );

    const authorizationRequest =
      await this.oAuthService.findAuthorizationRequestByAuthorizationCode(
        createTokenDto.code,
      );

    this.oAuthService.validateAuthorizationRequest(authorizationRequest);
    this.oAuthService.verifyState(authorizationRequest, createTokenDto.state);

    const owner = authorizationRequest.owner;
    const backpack = await this.backpackService.findBackpackByOwner(owner);

    const accessToken = this.oAuthService.createAccessToken(
      owner,
      backpack.id,
      authorizationRequest.scopes,
    );

    const refreshToken = this.oAuthService.createRefreshToken(
      owner,
      backpack.id,
      authorizationRequest.scopes,
    );

    return new TokenDto(tokenType, accessToken, expiresIn, refreshToken);
  }
}
