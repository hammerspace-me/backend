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
import { ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwtAuth.guard';
import { BackpackService } from 'src/backpack/service/backpack.service';
import CreateAuthorizationRequestDto from '../dto/createAuthorizationRequest.dto';
import { CreateTokenDto } from '../dto/createToken.dto';
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

@Controller('oauth')
export default class OAuthController {
  private readonly logger = new Logger(OAuthController.name);

  constructor(
    private readonly oAuthService: OAuthService,
    private readonly backpackService: BackpackService,
  ) {}

  @Post('authorize')
  @ApiResponse({
    status: 200,
    description: 'Authorization request has been created successfully',
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  public async createAuthorizationRequest(
    @Request() req,
    @Body() createAuthorizationRequestDto: CreateAuthorizationRequestDto,
  ): Promise<AuthorizationRequestEntity> {
    const owner = req.user.address;

    await this.oAuthService.ensureClientIdExists(
      createAuthorizationRequestDto.clientId,
    );

    const createdAuthorizationRequest =
      await this.oAuthService.createAuthorizationRequest(
        createAuthorizationRequestDto,
        owner,
      );

    return createdAuthorizationRequest;
  }

  @Post('authorize/:id')
  @ApiResponse({
    status: 200,
    description: 'Authorization request has been confirmed successfully',
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
  @HttpCode(201)
  public async createActivation(
    @Body() createActivationRequest: CreateActivationRequestDto,
  ) {
    await this.oAuthService.ensureClientIdExists(
      createActivationRequest.clientId,
    );
    return this.oAuthService.createActivation(createActivationRequest);
  }

  @Get('activation/:code')
  @UseInterceptors(ClassSerializerInterceptor)
  public async getActivation(@Param('code') code: string) {
    return this.oAuthService.findActivation(code);
  }

  @Get('application/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  public async getApplication(@Param('id', ParseUUIDPipe) id: string) {
    return this.oAuthService.findApplication(id);
  }

  @Post('activation/:code')
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
  @ApiResponse({
    status: 201,
    description: 'Token has been requested successfully',
  })
  @HttpCode(201)
  public async createToken(
    @Body()
    createToken: CreateTokenDto,
  ) {
    const tokenType = 'Bearer';
    const expiresIn = 900;

    let createTokenStrategy: CreateTokenStrategy;
    if (createToken.grantType === 'authorization_code') {
      createTokenStrategy = new CreateTokenByCodeStrategy(
        this.oAuthService,
        this.backpackService,
      );
    } else if (createToken.grantType === 'refresh_token') {
      createTokenStrategy = new CreateTokenByRefreshStrategy(
        this.oAuthService,
        this.backpackService,
      );
    }

    if (!createTokenStrategy) {
      throw new InvalidGrantTypeException();
    }

    return createTokenStrategy.createToken(createToken, tokenType, expiresIn);
  }
}