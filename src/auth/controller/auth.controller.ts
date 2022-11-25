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
import { SpaceService } from '../../space/service/space.service';
import { AuthService } from '../service/auth.service';
import { CreateNonceDto } from '../dto/createNonce.dto';
import { Response } from 'express';
import { LoginDto } from '../dto/login.dto';
import { SpaceNotFoundException } from 'src/space/exception/spaceNotFound.exception';
import { CreateSpaceDto } from 'src/space/dto/createSpace.dto';
import {
  LoginSuccessApiResponse,
  NonceSuccessApiResponse,
} from 'src/docs/responses/successApiResponse.decorator';
import { SpaceNotFoundApiResponse } from 'src/docs/responses/notFoundApiResponse.decorator';
import { UnauthorizedApiResponse } from 'src/docs/responses/authResponse.decorator';
import { ValidationFailedApiResponse } from 'src/docs/responses/validationApiResponse.decorator';
import { ServerErrorApiResponse } from 'src/docs/responses/serverErrorResponse.decorator';
import { ApiOperation } from '@nestjs/swagger';

@ServerErrorApiResponse()
@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly spaceService: SpaceService,
  ) {}

  @Post('auth/login')
  @LoginSuccessApiResponse()
  @SpaceNotFoundApiResponse()
  @ValidationFailedApiResponse()
  @UnauthorizedApiResponse()
  @ApiOperation({
    description: 'Login by providing a nonce signed with a private key.',
  })
  @HttpCode(201)
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

    const space = await this.spaceService.findSpaceByOwner(loginDto.address);

    const jwt = this.authService.createJwtToken(loginDto.address, space.id);
    return res.status(HttpStatus.CREATED).json({ accessToken: jwt });
  }

  @Post('auth/request')
  @NonceSuccessApiResponse()
  @ValidationFailedApiResponse()
  @ApiOperation({
    description:
      'Retrieve a nonce for login and create a space for the associated user if not existing.',
  })
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async createNonce(
    @Res() res: Response,
    @Body() createNonceDto: CreateNonceDto,
  ) {
    try {
      await this.spaceService.findSpaceByOwner(createNonceDto.owner);
    } catch (e) {
      if (e instanceof SpaceNotFoundException) {
        // If not existing, we create a new space
        const createSpaceDto: CreateSpaceDto = {
          owner: createNonceDto.owner,
          items: [],
        };
        await this.spaceService.createSpace(createSpaceDto);
      } else {
        this.logger.error(e);
      }
    }
    const createdNonce = await this.authService.createNonce(createNonceDto);
    return res.status(HttpStatus.CREATED).json(createdNonce);
  }
}
