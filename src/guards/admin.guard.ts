import { CanActivate, ExecutionContext } from '@nestjs/common';

/**
 * Validates that a client sending a request has admin rights.
 */
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.currentUser) return false;

    return request.currentUser.admin;
  }
}
