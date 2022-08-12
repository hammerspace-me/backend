import { BadRequestException } from '@nestjs/common';

export class AuthorizationRequestAlreadyInvalidException extends BadRequestException {
  constructor() {
    super(
      'Authorization request is already invalid',
      'AUTHORIZATION_REQUEST_ALREADY_INVALID',
    );
  }
}
