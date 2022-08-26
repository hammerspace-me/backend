import { ForbiddenException } from '@nestjs/common';

export class InvalidClientCredentialsException extends ForbiddenException {
  constructor() {
    super('Client credentials are invalid', 'INVALID_CLIENT_CREDENTIALS');
  }
}
