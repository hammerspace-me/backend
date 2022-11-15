import { ConflictException } from '@nestjs/common';

export class ApplicationExistsException extends ConflictException {
  constructor() {
    super('Application already exists', 'APPLICATION_EXISTS');
  }
}
