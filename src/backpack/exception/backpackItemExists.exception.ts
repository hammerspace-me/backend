import { ConflictException } from '@nestjs/common';

export class BackpackItemExistsException extends ConflictException {
  constructor() {
    super('Backpack item already exists', 'BACKPACK_ITEM_EXISTS');
  }
}
