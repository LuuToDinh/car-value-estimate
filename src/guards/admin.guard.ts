import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const { userId } = request.session || {};
    if (!userId) {
      return false;
    }

    return request.currentUser.admin;
  }
}
