import { NotFoundException } from '@nestjs/common';

export class ItemNotFoundException extends NotFoundException {
  constructor() {
    super('Item could not be found', 'ITEM_NOT_FOUND');
  }
}
