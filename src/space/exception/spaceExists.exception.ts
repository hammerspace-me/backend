import { ConflictException } from '@nestjs/common';

export class SpaceExistsException extends ConflictException {
  constructor() {
    super('Space already exists', 'SPACE_EXISTS');
  }
}
