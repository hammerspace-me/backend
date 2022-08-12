import { BackpackService } from 'src/backpack/service/backpack.service';
import CreateAuthorizationRequestDto from '../dto/createAuthorizationRequest.dto';
import { AccessTokenResponseDto } from '../dto/token.dto';
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
    createAuthorizationRequest: CreateAuthorizationRequestDto,
    owner: string,
  ): Promise<AuthorizationRequestEntity | AccessTokenResponseDto> {
    const backpack = await this.backpackService.findBackpackByOwner(owner);
    const accessToken = new AccessTokenResponseDto(
      'Bearer',
      this.oAuthService.createAccessToken(
        owner,
        backpack.id,
        createAuthorizationRequest.scopes,
      ),
      900,
      createAuthorizationRequest.state,
    );
    return accessToken;
  }
}
