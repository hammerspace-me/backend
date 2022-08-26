import { BadRequestException } from '@nestjs/common';

export class InvalidAuthorizationRequestException extends BadRequestException {
  constructor() {
    super('Authorization request is invalid', 'INVALID_AUTHORIZATION_REQUEST');
  }
}
