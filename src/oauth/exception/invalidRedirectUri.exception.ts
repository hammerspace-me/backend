import { BadRequestException } from '@nestjs/common';

export class InvalidRedirectUriException extends BadRequestException {
  constructor() {
    super(
      'Redirect URI in authorization request is invalid',
      'INVALID_REDIRECT_URI',
    );
  }
}
