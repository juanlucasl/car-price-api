import { CanActivate, ExecutionContext } from '@nestjs/common';

/**
 * Validates that a client sending a request is signed in to the application.
 */
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    return !!request.session.userId;
  }
}
