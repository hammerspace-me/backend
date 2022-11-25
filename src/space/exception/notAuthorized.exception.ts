import { UnauthorizedException } from '@nestjs/common';

export class NotAuthorizedException extends UnauthorizedException {
  constructor() {
    super('Not authorized to perform action', 'NOT_AUTHORIZED');
  }
}
