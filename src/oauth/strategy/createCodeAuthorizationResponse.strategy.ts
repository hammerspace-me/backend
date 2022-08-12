import { BackpackService } from 'src/backpack/service/backpack.service';
import CreateAuthorizationRequestDto from '../dto/createAuthorizationRequest.dto';
import { AccessTokenResponseDto } from '../dto/token.dto';
import AuthorizationRequestEntity from '../entity/authorizationRequest.entity';
import { OAuthService } from '../service/oAuth.service';
import { CreateAuthorizationResponseStrategy } from './createAuthorizationResponse.strategy';
import { GenerateAuthorizationCodeStrategy } from './generateAuthorizationCode.strategy';
import { GenerateAuthorizationCodeTokenStrategy } from './generateAuthorizationCodeToken.strategy';

export class CreateCodeAuthorizationResponseStrategy
  implements CreateAuthorizationResponseStrategy
{
  private readonly generateAuthorizationCodeStrategy: GenerateAuthorizationCodeStrategy;
  private readonly oAuthService: OAuthService;
  private readonly backpackService: BackpackService;

  constructor(oAuthService: OAuthService, backpackService: BackpackService) {
    this.oAuthService = oAuthService;
    this.backpackService = backpackService;
    this.generateAuthorizationCodeStrategy =
      new GenerateAuthorizationCodeTokenStrategy();
  }

  public async createAuthorizationResponse(
    createAuthorizationRequest: CreateAuthorizationRequestDto,
    owner: string,
  ): Promise<AuthorizationRequestEntity | AccessTokenResponseDto> {
    const authorizationRequest =
      await this.oAuthService.createAuthorizationRequest(
        createAuthorizationRequest,
        this.generateAuthorizationCodeStrategy,
        owner,
      );

    return authorizationRequest;
  }
}
