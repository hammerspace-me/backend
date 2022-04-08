import { NotFoundException } from '@nestjs/common';

export class BackpackNotFoundException extends NotFoundException {
  constructor() {
    super('Backpack could not be found', 'BACKPACK_NOT_FOUND');
  }
}
