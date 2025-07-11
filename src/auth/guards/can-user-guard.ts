import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { RequestWithUser } from 'src/Auth/components/interfaces/request-with-user.interface';
import { canUserCreateAccounts } from 'src/Auth/components/commons/permissions/create-user-permission.helper';

@Injectable()
export class CanCreateUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userRole = request.user?.role;

    if (!canUserCreateAccounts(userRole)) {
      throw new ForbiddenException('You are not allowed to create user accounts.');
    }

    return true;
  }
}
