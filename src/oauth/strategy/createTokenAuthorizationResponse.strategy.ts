import { SpaceService } from 'src/space/service/space.service';
import { AuthorizationCodeResponseDto } from '../dto/authorizationCodeResponse.dto';
import { AccessTokenResponseDto } from '../dto/accessTokenResponse.dto';
import AuthorizationRequestEntity from '../entity/authorizationRequest.entity';
import { OAuthService } from '../service/oAuth.service';
import { CreateAuthorizationResponseStrategy } from './createAuthorizationResponse.strategy';

export class CreateTokenAuthorizationResponseStrategy
  implements CreateAuthorizationResponseStrategy
{
  private readonly oAuthService: OAuthService;
  private readonly spaceService: SpaceService;

  constructor(oAuthService: OAuthService, spaceService: SpaceService) {
    this.oAuthService = oAuthService;
    this.spaceService = spaceService;
  }

  public async createAuthorizationResponse(
    authorizationRequest: AuthorizationRequestEntity,
  ): Promise<AuthorizationCodeResponseDto | AccessTokenResponseDto> {
    const invalidatedAuthorizationRequest =
      await this.oAuthService.invalidateAuthorizationRequest(
        authorizationRequest,
      );

    const space = await this.spaceService.findSpaceByOwner(
      invalidatedAuthorizationRequest.owner,
    );
    const accessToken = new AccessTokenResponseDto(
      'Bearer',
      this.oAuthService.createAccessToken(
        invalidatedAuthorizationRequest.owner,
        space.id,
        invalidatedAuthorizationRequest.scopes,
      ),
      900,
      invalidatedAuthorizationRequest.state,
    );
    return accessToken;
  }
}
