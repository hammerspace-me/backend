import { NotFoundException } from '@nestjs/common';

export class BackpackItemNotFoundException extends NotFoundException {
  constructor() {
    super('Backpack item could not be found', 'BACKPACK_ITEM_NOT_FOUND');
  }
}
