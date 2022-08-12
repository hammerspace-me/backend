import { BadRequestException } from '@nestjs/common';

export class InvalidResponseTypeException extends BadRequestException {
  constructor() {
    super(
      'Response type in authorization request is invalid',
      'INVALID_RESPONSE_TYPE',
    );
  }
}
