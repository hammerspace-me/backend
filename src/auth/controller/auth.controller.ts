import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  Res,
  Logger,
  HttpCode,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { BackpackService } from '../../backpack/service/backpack.service';
import { AuthService } from '../service/auth.service';
import { CreateNonceDto } from '../dto/createNonce.dto';
import { Response } from 'express';
import { LoginDto } from '../dto/login.dto';
import { BackpackNotFoundException } from 'src/backpack/exception/backpackNotFound.exception';
import { CreateBackpackDto } from 'src/backpack/dto/createBackpack.dto';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly backpackService: BackpackService,
  ) {}

  @Post('auth/login')
  @ApiResponse({
    status: 201,
    description: 'User has been logged in successfully',
  })
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    const nonce = await this.authService.getNonce(loginDto.address);
    // TODO: Check for timezones and add this.authService.checkNonceValidity(nonce.createdAt)
    if (!nonce) {
      throw new UnauthorizedException('Nonce is invalid', 'NONCE_INVALID');
    }

    if (!this.authService.verifySignatureAndNonce(loginDto, nonce.nonce)) {
      throw new UnauthorizedException(
        'Wrong credentials presented',
        'WRONG_CREDENTIALS',
      );
    }

    const backpack = await this.backpackService.findBackpackByOwner(
      loginDto.address,
    );

    const jwt = this.authService.createJwtToken(loginDto.address, backpack.id);
    return res.status(HttpStatus.CREATED).json({ accessToken: jwt });
  }

  @Post('auth/request')
  @ApiResponse({
    status: 201,
    description: 'Nonce has been created successfully',
  })
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async createNonce(
    @Res() res: Response,
    @Body() createNonceDto: CreateNonceDto,
  ) {
    try {
      await this.backpackService.findBackpackByOwner(createNonceDto.owner);
    } catch (e) {
      if (e instanceof BackpackNotFoundException) {
        // If not existing, we create a new backpack
        const createBackpackDto: CreateBackpackDto = {
          owner: createNonceDto.owner,
          backpackItems: [],
        };
        await this.backpackService.createBackpack(createBackpackDto);
      } else {
        this.logger.error(e);
      }
    }
    const createdNonce = await this.authService.createNonce(createNonceDto);
    return res.status(HttpStatus.CREATED).json(createdNonce);
  }
}
