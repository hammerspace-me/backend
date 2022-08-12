import CreateAuthorizationRequestDto from '../dto/createAuthorizationRequest.dto';
import { AccessTokenResponseDto } from '../dto/token.dto';
import AuthorizationRequestEntity from '../entity/authorizationRequest.entity';

export interface CreateAuthorizationResponseStrategy {
  createAuthorizationResponse(
    createAuthorizationRequestDto: CreateAuthorizationRequestDto,
    owner: string,
  ): Promise<AuthorizationRequestEntity | AccessTokenResponseDto>;
}
