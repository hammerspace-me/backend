import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateActivationRequestDto from '../dto/createActivationRequest.dto';
import CreateAuthorizationRequestDto from '../dto/createAuthorizationRequest.dto';
import UpdateActivationRequestDto from '../dto/updateActivationRequest.dto';
import ActivationRequestEntity from '../entity/activationRequest.entity';
import ApplicationEntity from '../entity/application.entity';
import AuthorizationRequestEntity from '../entity/authorizationRequest.entity';
import { ActivationRequestNotFoundException } from '../exception/activationRequestNotFound.exception';
import { AuthorizationRequestAlreadyConfirmedException } from '../exception/authorizationRequestAlreadyConfirmed.exception';
import { AuthorizationRequestAlreadyInvalidException } from '../exception/authorizationRequestAlreadyInvalid.exception';
import { AuthorizationRequestNotFoundException } from '../exception/authorizationRequestNotFound.exception';
import { ClientNotFoundException } from '../exception/clientNotFound.exception';
import { InvalidAuthorizationRequestException } from '../exception/invalidAuthorizationRequest.exception';
import { InvalidClientCredentialsException } from '../exception/invalidClientCredentials.exception';
import { InvalidOwnerException } from '../exception/invalidOwner.exception';
import { InvalidRedirectUriException } from '../exception/invalidRedirectUri.exception';
import { InvalidStateException } from '../exception/invalidState.exception';
import { GenerateAuthorizationCodeStrategy } from '../strategy/generateAuthorizationCode.strategy';
import { generateActivationCode } from '../utils/activationCode.utils';

@Injectable()
export class OAuthService {
  constructor(
    @InjectRepository(ActivationRequestEntity)
    private readonly activationRequestRepository: Repository<ActivationRequestEntity>,
    @InjectRepository(AuthorizationRequestEntity)
    private readonly authorizationRequestRepository: Repository<AuthorizationRequestEntity>,
    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async createAuthorizationRequest(
    authorizationRequest: CreateAuthorizationRequestDto,
    owner: string,
  ): Promise<AuthorizationRequestEntity> {
    const createAuthorizationRequest =
      this.authorizationRequestRepository.create({
        ...authorizationRequest,
        owner: owner,
        valid: true,
      });

    return this.authorizationRequestRepository.save(createAuthorizationRequest);
  }

  public async confirmAuthorizationRequest(
    authorizationRequest: AuthorizationRequestEntity,
    authorizationCodeStrategy: GenerateAuthorizationCodeStrategy,
  ): Promise<AuthorizationRequestEntity> {
    if (authorizationRequest.confirmed) {
      throw new AuthorizationRequestAlreadyConfirmedException();
    }

    await this.authorizationRequestRepository.update(authorizationRequest.id, {
      authorizationCode: authorizationCodeStrategy.generateAuthorizationCode(),
      confirmed: true,
    });

    const confirmedAuthorizationRequest = await this.findAuthorizationRequest(
      authorizationRequest.id,
    );

    return confirmedAuthorizationRequest;
  }

  public async invalidateAuthorizationRequest(
    authorizationRequest: AuthorizationRequestEntity,
  ): Promise<AuthorizationRequestEntity> {
    if (!authorizationRequest.valid) {
      throw new AuthorizationRequestAlreadyInvalidException();
    }

    await this.authorizationRequestRepository.update(authorizationRequest.id, {
      valid: false,
    });

    const invalidatedAuthorizationRequest = await this.findAuthorizationRequest(
      authorizationRequest.id,
    );

    return invalidatedAuthorizationRequest;
  }

  public async ensureOwnershipOfAuthorizationRequest(
    id: string,
    owner: string,
  ) {
    const authorizationRequest = await this.findAuthorizationRequest(id);
    if (authorizationRequest.owner !== owner) {
      throw new InvalidOwnerException();
    }
  }

  public async findAuthorizationRequest(
    id: string,
  ): Promise<AuthorizationRequestEntity> {
    const authorizationRequest =
      await this.authorizationRequestRepository.findOne(id);
    if (!authorizationRequest) {
      throw new AuthorizationRequestNotFoundException();
    }
    return authorizationRequest;
  }

  public async findAuthorizationRequestByAuthorizationCode(
    authorizationCode: string,
  ): Promise<AuthorizationRequestEntity> {
    const authorizationRequest =
      await this.authorizationRequestRepository.findOne({
        where: { authorizationCode },
      });
    if (!authorizationRequest) {
      throw new AuthorizationRequestNotFoundException();
    }
    return authorizationRequest;
  }

  public async validateAuthorizationRequest(
    authorizationRequest: AuthorizationRequestEntity,
  ) {
    const expirationTimestamp = Date.now() - 600 * 1000;
    const expired =
      authorizationRequest.createdAt.getTime() > expirationTimestamp;

    if (!authorizationRequest.valid || expired) {
      throw new InvalidAuthorizationRequestException();
    }
  }

  public createAccessToken(
    address: string,
    backpackId: string,
    scopes: string[],
  ): string {
    const payload = {
      sub: address,
      backpack: backpackId,
      scopes: scopes.join(' '),
    };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });
  }

  public createRefreshToken(
    address: string,
    backpackId: string,
    scopes: string[],
  ): string {
    const payload = {
      sub: address,
      backpack: backpackId,
      scopes: scopes.join(' '),
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });
  }

  public validateRefreshTokenAndExtractPayload(refreshToken: string) {
    return this.jwtService.verify(refreshToken, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
  }

  public async ensureClientIdExists(clientId: string): Promise<void> {
    const id = clientId;
    const application = await this.applicationRepository.findOne(id);

    if (!application) {
      throw new ClientNotFoundException();
    }
  }

  public async verifyClientIdAndSecret(
    clientId: string,
    clientSecret: string,
  ): Promise<void> {
    const application = await this.applicationRepository.findOne(clientId);
    if (!application) {
      throw new ClientNotFoundException();
    }

    if (application.clientSecret !== clientSecret) {
      throw new InvalidClientCredentialsException();
    }
  }

  public async validateRedirectUri(
    clientId: string,
    redirectUri: string,
  ): Promise<void> {
    const id = clientId;
    const application = await this.applicationRepository.findOne(id);
    if (!application) {
      throw new ClientNotFoundException();
    }

    if (redirectUri && redirectUri !== application.redirectUri) {
      throw new InvalidRedirectUriException();
    }
  }

  public verifyState(
    authorizationRequest: AuthorizationRequestEntity,
    state: string,
  ) {
    if (
      authorizationRequest.state !== null &&
      authorizationRequest.state !== state
    ) {
      throw new InvalidStateException();
    }
  }

  public async createActivation(
    createActivationRequest: CreateActivationRequestDto,
  ) {
    const activationRequest = this.activationRequestRepository.create({
      ...createActivationRequest,
      activationCode: generateActivationCode(6),
      expiration: 900,
    });
    return this.activationRequestRepository.save(activationRequest);
  }

  public async findActivation(code: string) {
    const activation = await this.activationRequestRepository.findOne({
      where: { activationCode: code },
    });
    if (!activation) {
      throw new ActivationRequestNotFoundException();
    }
    return activation;
  }

  public async ensureOwnershipOfActivationRequest(code: string, owner: string) {
    const activation = await this.findActivation(code);
    if (!activation.owner) {
      await this.activationRequestRepository.update(activation.id, { owner });
    } else if (activation.owner !== owner) {
      throw new InvalidOwnerException();
    }
  }

  public async updateActivationRequest(
    code: string,
    updateActivationRequest: UpdateActivationRequestDto,
  ) {
    const activation = await this.findActivation(code);
    await this.activationRequestRepository.update(
      activation.id,
      updateActivationRequest,
    );

    return this.findActivation(activation.activationCode);
  }

  public async findApplication(clientId: string) {
    const application = await this.applicationRepository.findOne(clientId);
    if (!application) {
      throw new ClientNotFoundException();
    }
    return application;
  }
}
