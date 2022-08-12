import { SetMetadata } from '@nestjs/common';
import { Scopes as ScopesEnum } from '../enum/scopes.enum';

export const Scopes = (...scopes: ScopesEnum[]) =>
  SetMetadata('scopes', scopes);
