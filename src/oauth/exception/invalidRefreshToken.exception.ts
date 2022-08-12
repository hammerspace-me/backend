import { BadRequestException } from '@nestjs/common';

export class InvalidRefreshTokenException extends BadRequestException {
  constructor() {
    super('Refresh token is invalid', 'INVALID_REFRESH_TOKEN');
  }
}
