import { NotFoundException } from '@nestjs/common';

export class AuthorizationRequestNotFoundException extends NotFoundException {
  constructor() {
    super(
      'Authorization request could not be found',
      'AUTHORIZATION_REQUEST_NOT_FOUND',
    );
  }
}
