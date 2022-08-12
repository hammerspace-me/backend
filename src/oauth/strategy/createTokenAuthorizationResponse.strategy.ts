import { BackpackService } from 'src/backpack/service/backpack.service';
import { AuthorizationCodeResponseDto } from '../dto/authorizationCodeResponse.dto';
import { AccessTokenResponseDto } from '../dto/accessTokenResponse.dto';
import AuthorizationRequestEntity from '../entity/authorizationRequest.entity';
import { OAuthService } from '../service/oAuth.service';
import { CreateAuthorizationResponseStrategy } from './createAuthorizationResponse.strategy';

export class CreateTokenAuthorizationResponseStrategy
  implements CreateAuthorizationResponseStrategy
{
  private readonly oAuthService: OAuthService;
  private readonly backpackService: BackpackService;

  constructor(oAuthService: OAuthService, backpackService: BackpackService) {
    this.oAuthService = oAuthService;
    this.backpackService = backpackService;
  }

  public async createAuthorizationResponse(
    authorizationRequest: AuthorizationRequestEntity,
  ): Promise<AuthorizationCodeResponseDto | AccessTokenResponseDto> {
    const invalidatedAuthorizationRequest =
      await this.oAuthService.invalidateAuthorizationRequest(
        authorizationRequest,
      );

    const backpack = await this.backpackService.findBackpackByOwner(
      invalidatedAuthorizationRequest.owner,
    );
    const accessToken = new AccessTokenResponseDto(
      'Bearer',
      this.oAuthService.createAccessToken(
        invalidatedAuthorizationRequest.owner,
        backpack.id,
        invalidatedAuthorizationRequest.scopes,
      ),
      900,
      invalidatedAuthorizationRequest.state,
    );
    return accessToken;
  }
}
