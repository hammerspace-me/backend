import { ForbiddenException } from '@nestjs/common';

export class InvalidOwnerException extends ForbiddenException {
  constructor() {
    super('Owner is invalid', 'INVALID_OWNER');
  }
}
