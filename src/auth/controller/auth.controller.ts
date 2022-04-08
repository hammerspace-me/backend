import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { BackpackService } from '../../backpack/service/backpack.service';
import { AuthService } from '../service/auth.service';
import { CreateNonceDto } from '../dto/createNonce.dto';
import { Response } from 'express';
import { LoginDto } from '../dto/login.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly backpackService: BackpackService,
  ) {}

  @Post('auth/login')
  @ApiResponse({
    status: 201,
    description: 'Nonce has been created successfully',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  public async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    const nonce = await this.authService.getNonce(loginDto.address);
    if (!nonce || this.authService.checkNonceValidity(nonce.createdAt)) {
      throw new UnauthorizedException('Nonce is invalid', 'NONCE_INVALID');
    }

    if (!this.authService.verifySignatureAndNonce(loginDto, nonce.nonce)) {
      throw new UnauthorizedException(
        'Wrong credentials presented',
        'WRONG_CREDENTIALS',
      );
    }
    const jwt = this.authService.createJwtToken(loginDto.address);
    return res.status(HttpStatus.CREATED).json({ accessToken: jwt });
  }

  @Post('auth/request')
  @ApiResponse({
    status: 201,
    description: 'Nonce has been created successfully',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  public async createNonce(
    @Res() res: Response,
    @Body() createNonceDto: CreateNonceDto,
  ) {
    await this.backpackService.findBackpack(createNonceDto.backpack);
    const createdNonce = await this.authService.createNonce(createNonceDto);
    return res.status(HttpStatus.CREATED).json(createdNonce);
  }
}
