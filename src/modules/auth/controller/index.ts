import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  Res,
  HttpCode,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { Response } from 'express';

import { CreateNonceDto, LoginDto, RegisterDto } from './dto';

@Controller()
export class AuthController {
  @Post('auth/nonce')
  @ApiResponse({
    status: 201,
    description: 'Nonce for login/signup has been created',
  })
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async createNonce(
    @Res() res: Response,
    @Body() { address }: CreateNonceDto,
  ) {
    const returnValue = {
      action: 'register',
      nonce: 'XXX',
    };

    return res.status(HttpStatus.CREATED).json(returnValue);
  }

  @Post('auth/login')
  @ApiResponse({
    status: 200,
    description: 'User has logged in',
  })
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async login(@Res() res: Response, @Body() {}: LoginDto) {
    const returnValue = {
      accessToken: 'jwt',
    };

    return res.status(HttpStatus.ACCEPTED).json(returnValue);
  }

  @Post('auth/register')
  @ApiResponse({
    status: 201,
    description: 'User has been registered',
  })
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async register(@Res() res: Response, @Body() {}: RegisterDto) {
    const returnValue = {
      accessToken: 'jwt',
    };

    return res.status(HttpStatus.ACCEPTED).json(returnValue);
  }
}
