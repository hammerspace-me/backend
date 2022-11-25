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
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwtAuth.guard';
import { SpaceService } from 'src/space/service/space.service';
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
import { Environment } from '../enum/environment.enum';
import { CreateApplicationDto } from '../dto/createApplication.dto';
import { DeleteApplicationDto } from '../dto/deleteApplication.dto';
import { ApplicationExistsApiResponse } from 'src/docs/responses/existsApiResponse.decorator';
import { UpdateApplicationDto } from '../dto/updateApplication.dto';

@Controller('oauth')
@ServerErrorApiResponse()
export default class OAuthController {
  private readonly logger = new Logger(OAuthController.name);

  constructor(
    private readonly oAuthService: OAuthService,
    private readonly spaceService: SpaceService,
  ) {}

  @Post('authorize')
  @AuthorizationRequestSuccessApiResponse(EndpointMethod.CREATE)
  @ApplicationNotFoundApiResponse()
  @ValidationFailedApiResponse()
  @UnauthorizedApiResponse()
  @ApiBearerAuth()
  @ApiOperation({
    description:
      'Create an authorization request for OAuth2 authorization code flow.',
  })
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

    // Only validate the redirect URI when the client application is for a production environment.
    // Ensures easier integration with third-party applications due
    // to changing redirectURIs in development mode
    if (application.environment === Environment.prod) {
      await this.oAuthService.validateRedirectUri(
        application,
        createAuthorizationRequestDto.redirectUri,
      );
    }

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
  @ApiOperation({
    description:
      'Confirm an authorization request for OAuth2 authorization code flow.',
  })
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
          this.spaceService,
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
  @ApiOperation({
    description:
      'Create an activation code request (used for devices with limited input capabilities).',
  })
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
  @ApiOperation({
    description: 'Retrieve an activation code request by the associated code.',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  public async getActivation(@Param('code') code: string) {
    return this.oAuthService.findActivation(code);
  }

  @Post('activation/:code')
  @ActivationRequestSuccessApiResponse(EndpointMethod.UPDATE)
  @ActivationRequestNotFoundApiResponse()
  @ValidationFailedApiResponse()
  @UnauthorizedApiResponse()
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Update an activation code request and take ownership.',
  })
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
  @ApiOperation({
    description:
      'Create a token based on refresh token or authorization code (adheres to OAuth2 standard).',
  })
  @HttpCode(201)
  public async createToken(@Body() createToken: CreateTokenDto) {
    const tokenType = 'Bearer';
    const expiresIn = 900;

    let createTokenStrategy: CreateTokenStrategy;
    if (createToken.grant_type === 'authorization_code') {
      createTokenStrategy = new CreateTokenByCodeStrategy(
        this.oAuthService,
        this.spaceService,
      );
    } else if (createToken.grant_type === 'refresh_token') {
      createTokenStrategy = new CreateTokenByRefreshStrategy(
        this.oAuthService,
        this.spaceService,
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

  @Get('application/:id')
  @ApplicationSuccessApiResponse(EndpointMethod.READ)
  @ApplicationNotFoundApiResponse()
  @ValidationFailedApiResponse()
  @ApiOperation({
    description: 'Retrieve a client application associated to the provided id.',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  public async getApplication(@Param('id', ParseUUIDPipe) id: string) {
    return this.oAuthService.findApplication(id);
  }

  @Post('application')
  @ApiOperation({
    description: 'Register a new client application.',
  })
  @ApplicationSuccessApiResponse(EndpointMethod.CREATE)
  @ApplicationExistsApiResponse()
  @ValidationFailedApiResponse()
  @HttpCode(201)
  public async createApplication(
    @Body() createApplication: CreateApplicationDto,
  ) {
    const createdApplication = await this.oAuthService.createApplication(
      createApplication,
    );

    // We want to explicitly show the client secret on this endpoint
    return {
      ...createdApplication,
      clientSecret: createdApplication.clientSecret,
    };
  }

  @Delete('application/:id')
  @ApplicationSuccessApiResponse(EndpointMethod.DELETE)
  @ApplicationNotFoundApiResponse()
  @ValidationFailedApiResponse()
  @UnauthorizedApiResponse()
  @ApiOperation({
    description: 'Delete a client application.',
  })
  @HttpCode(200)
  public async deleteApplication(
    @Param('id') id: string,
    @Body() deleteApplication: DeleteApplicationDto,
  ) {
    return await this.oAuthService.deleteApplication(id, deleteApplication);
  }

  @Post('application/:id')
  @ApplicationSuccessApiResponse(EndpointMethod.UPDATE)
  @ApplicationNotFoundApiResponse()
  @ValidationFailedApiResponse()
  @UnauthorizedApiResponse()
  @ApiOperation({
    description: 'Update a client application.',
  })
  @HttpCode(200)
  public async updateApplication(
    @Param('id') id: string,
    @Body() updateApplication: UpdateApplicationDto,
  ) {
    return await this.oAuthService.updateApplication(id, updateApplication);
  }
}
