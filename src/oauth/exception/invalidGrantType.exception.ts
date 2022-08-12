import { BadRequestException } from '@nestjs/common';

export class InvalidGrantTypeException extends BadRequestException {
  constructor() {
    super('Grant type in token request is invalid', 'INVALID_GRANT_TYPE');
  }
}
