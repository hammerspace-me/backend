import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  Res,
  HttpCode,
  Get,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { Response } from 'express';

import {
  AuthorizeDto,
  CreateActivationCodeDto,
  CreateTokenUsingAuthorizationCodeDto,
  CreateTokenUsingRefreshDto,
  GetActivationCodeDto,
  GetWebAuthorizationDto,
  GetNativeAuthorizationDto,
} from './dto';

@Controller()
export default class OAuthController {
  // TODO: IsUser() guard
  @Post('oauth/authorize')
  @ApiResponse({
    status: 200,
    description: 'Application authorized for requested scopes on user',
  })
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async authorize(@Res() res: Response, @Body() {}: AuthorizeDto) {
    const returnValue = {
      activationCode: 'XXX',
      expiresAt: new Date(),
      scopes: ['test'],
    };

    return res.status(HttpStatus.OK).json(returnValue);
  }

  @Post('oauth/token')
  @ApiResponse({
    status: 201,
    description: 'Application authorized for requested scopes on user',
  })
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async createToken(
    @Res() res: Response,
    @Body()
    {}: CreateTokenUsingAuthorizationCodeDto | CreateTokenUsingRefreshDto,
  ) {
    const returnValue = {
      subject: 'XXX',
      accessToken: 'XXX',
      refreshToken: 'XXX',
      expiresAt: new Date(),
      scopes: ['test'],
    };

    return res.status(HttpStatus.CREATED).json(returnValue);
  }

  @Post('oauth/activation')
  @ApiResponse({
    status: 201,
    description: 'An Activation Code has been created',
  })
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async createActivationCode(
    @Res() res: Response,
    @Body() {}: CreateActivationCodeDto,
  ) {
    const returnValue = {
      activationCode: 'XXX',
      expiresAt: new Date(),
      scopes: ['test'],
    };

    return res.status(HttpStatus.CREATED).json(returnValue);
  }

  @Get('oauth/activation')
  @ApiResponse({
    status: 202,
    description: 'Activation code found, but not connected to user account',
  })
  @ApiResponse({
    status: 200,
    description: 'A user has authorized the activation code',
  })
  @HttpCode(202)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async getActivationCode(
    @Res() res: Response,
    @Body() {}: GetActivationCodeDto,
  ) {
    const returnValue = {
      subject: 'XXX',
      accessToken: 'XXX',
      refreshToken: 'XXX',
      expiresAt: new Date(),
      scopes: ['test'],
    };

    return res.status(HttpStatus.ACCEPTED).json(returnValue);
  }

  // TODO: IsUser()
  @Get('oauth/authorization')
  @ApiResponse({
    status: 200,
    description: 'Authorization information verified for a user to approve',
  })
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async getAuthorizationRequest(
    @Res() res: Response,
    @Body() {}: GetWebAuthorizationDto | GetNativeAuthorizationDto,
  ) {
    const returnValue = {
      subject: 'XXX',
      accessToken: 'XXX',
      refreshToken: 'XXX',
      expiresAt: new Date(),
      scopes: ['test'],
    };

    return res.status(HttpStatus.OK).json(returnValue);
  }
}
