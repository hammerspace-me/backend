import { NotFoundException } from '@nestjs/common';

export class ActivationRequestNotFoundException extends NotFoundException {
  constructor() {
    super(
      'Activation request could not be found',
      'ACTIVATION_REQUEST_NOT_FOUND',
    );
  }
}
