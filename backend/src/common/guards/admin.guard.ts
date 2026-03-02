import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const role = request.user?.role || 'user';
    if (role !== 'admin') {
      throw new ForbiddenException('Admin access required');
    }
    return true;
  }
}
