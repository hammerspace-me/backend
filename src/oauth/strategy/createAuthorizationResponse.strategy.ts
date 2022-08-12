import { AuthorizationCodeResponseDto } from '../dto/authorizationCodeResponse.dto';
import { AccessTokenResponseDto } from '../dto/accessTokenResponse.dto';
import AuthorizationRequestEntity from '../entity/authorizationRequest.entity';

export interface CreateAuthorizationResponseStrategy {
  createAuthorizationResponse(
    authorizationRequest: AuthorizationRequestEntity,
  ): Promise<AuthorizationCodeResponseDto | AccessTokenResponseDto>;
}
