import { ConflictException } from '@nestjs/common';

export class ItemExistsException extends ConflictException {
  constructor() {
    super('Item already exists', 'ITEM_EXISTS');
  }
}
