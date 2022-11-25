import { NotFoundException } from '@nestjs/common';

export class SpaceNotFoundException extends NotFoundException {
  constructor() {
    super('Space could not be found', 'SPACE_NOT_FOUND');
  }
}
