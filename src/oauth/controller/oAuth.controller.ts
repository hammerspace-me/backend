import {
  Controller,
  Post,
  HttpCode,
  Logger,
  Request,
  Body,
  UseGuards,
  Get,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwtAuth.guard';
import { BackpackService } from 'src/backpack/service/backpack.service';
import CreateAuthorizationRequestDto from '../dto/createAuthorizationRequest.dto';
import { InvalidGrantTypeException } from '../exception/invalidGrantType.exception';
import { InvalidResponseTypeException } from '../exception/invalidResponseType.exception';
import { OAuthService } from '../service/oAuth.service';
import { CreateAuthorizationResponseStrategy } from '../strategy/createAuthorizationResponse.strategy';
import { CreateTokenAuthorizationResponseStrategy } from '../strategy/createTokenAuthorizationResponse.strategy';
import { CreateTokenStrategy } from '../strategy/createToken.strategy';
import { CreateTokenByCodeStrategy } from '../strategy/createTokenByCode.strategy';
import { CreateTokenByRefreshStrategy } from '../strategy/createTokenByRefresh.strategy';
import CreateActivationRequestDto from '../dto/createActivationRequest.dto';
import UpdateActivationRequestDto from '../dto/updateActivationRequest.dto';
import { CreateCodeAuthorizationResponseStrategy } from '../strategy/createCodeAuthorizationResponse.strategy';
import { AuthorizationCodeResponseDto } from '../dto/authorizationCodeResponse.dto';
import { AccessTokenResponseDto } from '../dto/accessTokenResponse.dto';
import AuthorizationRequestEntity from '../entity/authorizationRequest.entity';
import { CreateTokenDto } from '../dto/createToken.dto';
import { ServerErrorApiResponse } from 'src/docs/responses/serverErrorResponse.decorator';
import { ValidationFailedApiResponse } from 'src/docs/responses/validationApiResponse.decorator';
import {
  ActivationRequestSuccessApiResponse,
  ApplicationSuccessApiResponse,
  AuthorizationRequestSuccessApiResponse,
  TokenSuccessApiResponse,
} from 'src/docs/responses/successApiResponse.decorator';
import {
  ActivationRequestNotFoundApiResponse,
  ApplicationNotFoundApiResponse,
  AuthorizationRequestNotFoundApiResponse,
} from 'src/docs/responses/notFoundApiResponse.decorator';
import { UnauthorizedApiResponse } from 'src/docs/responses/authResponse.decorator';
import { EndpointMethod } from 'src/docs/responses/endpointMethod.enum';

@Controller('oauth')
@ServerErrorApiResponse()
export default class OAuthController {
  private readonly logger = new Logger(OAuthController.name);

  constructor(
    private readonly oAuthService: OAuthService,
    private readonly backpackService: BackpackService,
  ) {}

  @Post('authorize')
  @AuthorizationRequestSuccessApiResponse(EndpointMethod.CREATE)
  @ApplicationNotFoundApiResponse()
  @ValidationFailedApiResponse()
  @UnauthorizedApiResponse()
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  public async createAuthorizationRequest(
    @Request() req,
    @Body() createAuthorizationRequestDto: CreateAuthorizationRequestDto,
  ): Promise<AuthorizationRequestEntity> {
    const owner = req.user.address;

    const application = await this.oAuthService.findApplication(
      createAuthorizationRequestDto.clientId,
    );

    await this.oAuthService.validateRedirectUri(
      application,
      createAuthorizationRequestDto.redirectUri,
    );

    const createdAuthorizationRequest =
      await this.oAuthService.createAuthorizationRequest(
        createAuthorizationRequestDto,
        owner,
      );

    if (!createdAuthorizationRequest.redirectUri) {
      createdAuthorizationRequest.redirectUri = application.redirectUri;
    }

    return createdAuthorizationRequest;
  }

  @Post('authorize/:id')
  @AuthorizationRequestSuccessApiResponse(EndpointMethod.UPDATE)
  @ValidationFailedApiResponse()
  @UnauthorizedApiResponse()
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  public async confirmAuthorizationRequest(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AuthorizationCodeResponseDto | AccessTokenResponseDto> {
    const owner = req.user.address;
    await this.oAuthService.ensureOwnershipOfAuthorizationRequest(id, owner);
    const authorizationRequest =
      await this.oAuthService.findAuthorizationRequest(id);

    const responseType = authorizationRequest.responseType;
    let createAuthorizationResponseStrategy: CreateAuthorizationResponseStrategy;
    if (responseType === 'token') {
      createAuthorizationResponseStrategy =
        new CreateTokenAuthorizationResponseStrategy(
          this.oAuthService,
          this.backpackService,
        );
    } else if (responseType === 'code') {
      createAuthorizationResponseStrategy =
        new CreateCodeAuthorizationResponseStrategy(this.oAuthService);
    }

    if (!createAuthorizationResponseStrategy) {
      throw new InvalidResponseTypeException();
    }

    return createAuthorizationResponseStrategy.createAuthorizationResponse(
      authorizationRequest,
    );
  }

  @Post('activation')
  @ActivationRequestSuccessApiResponse(EndpointMethod.CREATE)
  @ApplicationNotFoundApiResponse()
  @ValidationFailedApiResponse()
  @HttpCode(201)
  public async createActivation(
    @Body() createActivationRequest: CreateActivationRequestDto,
  ) {
    // Note: this ensures that the application exists
    await this.oAuthService.findApplication(createActivationRequest.clientId);
    return this.oAuthService.createActivation(createActivationRequest);
  }

  @Get('activation/:code')
  @ActivationRequestSuccessApiResponse(EndpointMethod.READ)
  @ActivationRequestNotFoundApiResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  public async getActivation(@Param('code') code: string) {
    return this.oAuthService.findActivation(code);
  }

  @Get('application/:id')
  @ApplicationSuccessApiResponse(EndpointMethod.READ)
  @ApplicationNotFoundApiResponse()
  @ValidationFailedApiResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  public async getApplication(@Param('id', ParseUUIDPipe) id: string) {
    return this.oAuthService.findApplication(id);
  }

  @Post('activation/:code')
  @ActivationRequestSuccessApiResponse(EndpointMethod.UPDATE)
  @ActivationRequestNotFoundApiResponse()
  @ValidationFailedApiResponse()
  @UnauthorizedApiResponse()
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  public async updateActivation(
    @Request() req,
    @Param('code') code: string,
    @Body()
    updateActivationRequest: UpdateActivationRequestDto,
  ) {
    const owner = req.user.address;
    await this.oAuthService.ensureOwnershipOfActivationRequest(code, owner);
    return this.oAuthService.updateActivationRequest(
      code,
      updateActivationRequest,
    );
  }

  @Post('token')
  @TokenSuccessApiResponse()
  @AuthorizationRequestNotFoundApiResponse()
  @ValidationFailedApiResponse()
  @UnauthorizedApiResponse()
  @HttpCode(201)
  public async createToken(@Body() createToken: CreateTokenDto) {
    const tokenType = 'Bearer';
    const expiresIn = 900;

    let createTokenStrategy: CreateTokenStrategy;
    if (createToken.grant_type === 'authorization_code') {
      createTokenStrategy = new CreateTokenByCodeStrategy(
        this.oAuthService,
        this.backpackService,
      );
    } else if (createToken.grant_type === 'refresh_token') {
      createTokenStrategy = new CreateTokenByRefreshStrategy(
        this.oAuthService,
        this.backpackService,
      );
    }

    if (!createTokenStrategy) {
      throw new InvalidGrantTypeException();
    }

    const token = await createTokenStrategy.createToken(
      createToken,
      tokenType,
      expiresIn,
    );

    return {
      access_token: token.accessToken,
      expires_in: token.expiresIn,
      refresh_token: token.refreshToken,
      token_type: token.tokenType,
    };
  }
}
