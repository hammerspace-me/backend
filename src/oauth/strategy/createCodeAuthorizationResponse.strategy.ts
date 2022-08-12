import { BackpackService } from 'src/backpack/service/backpack.service';
import { AccessTokenResponseDto } from '../dto/accessTokenResponse.dto';
import { AuthorizationCodeResponseDto } from '../dto/authorizationCodeResponse.dto';
import AuthorizationRequestEntity from '../entity/authorizationRequest.entity';
import { OAuthService } from '../service/oAuth.service';
import { CreateAuthorizationResponseStrategy } from './createAuthorizationResponse.strategy';
import { GenerateAuthorizationCodeTokenStrategy } from './generateAuthorizationCodeToken.strategy';

export class CreateCodeAuthorizationResponseStrategy
  implements CreateAuthorizationResponseStrategy
{
  private readonly oAuthService: OAuthService;

  constructor(oAuthService: OAuthService) {
    this.oAuthService = oAuthService;
  }

  public async createAuthorizationResponse(
    authorizationRequest: AuthorizationRequestEntity,
  ): Promise<AuthorizationCodeResponseDto | AccessTokenResponseDto> {
    const confirmedAuthorizationRequest =
      await this.oAuthService.confirmAuthorizationRequest(
        authorizationRequest,
        new GenerateAuthorizationCodeTokenStrategy(),
      );

    return new AuthorizationCodeResponseDto(
      confirmedAuthorizationRequest.authorizationCode,
      confirmedAuthorizationRequest.state,
    );
  }
}
