import { NotFoundException } from '@nestjs/common';

export class ClientNotFoundException extends NotFoundException {
  constructor() {
    super('Client could not be found', 'CLIENT_NOT_FOUND');
  }
}
