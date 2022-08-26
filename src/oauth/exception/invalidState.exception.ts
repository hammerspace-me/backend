import { BadRequestException } from '@nestjs/common';

export class InvalidStateException extends BadRequestException {
  constructor() {
    super(
      'State in token request does not match with authorization request',
      'INVALID_STATE',
    );
  }
}
