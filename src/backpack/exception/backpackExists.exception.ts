import { ConflictException } from '@nestjs/common';

export class BackpackExistsException extends ConflictException {
  constructor() {
    super('Backpack already exists', 'BACKPACK_EXISTS');
  }
}
