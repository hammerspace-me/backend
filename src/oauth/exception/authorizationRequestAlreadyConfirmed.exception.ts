import { BadRequestException } from '@nestjs/common';

export class AuthorizationRequestAlreadyConfirmedException extends BadRequestException {
  constructor() {
    super(
      'Authorization request is already confirmed',
      'AUTHORIZATION_REQUEST_ALREADY_CONFIRMED',
    );
  }
}
