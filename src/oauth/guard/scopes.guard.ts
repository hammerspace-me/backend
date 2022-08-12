import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Scope,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Scopes } from '../enum/scopes.enum';

@Injectable()
export class ScopesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const scopes = this.reflector.get<Scope[]>('scopes', context.getHandler());
    if (!scopes) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user.scopes) {
      return false;
    }

    const userScopes = user.scopes
      .split(' ')
      .map((scope: Scope) => Scopes[scope]);

    return scopes.every((scope) => userScopes.includes(scope));
  }
}
