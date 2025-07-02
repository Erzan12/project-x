// auth/guards/roles-permissions.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class RolesPermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(), context.getClass()]);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No user found in request');
    }  

    console.log('Request user:', user);

    if (requiredRoles?.length > 0) {
      //user.role?.name -> payload on jwtStrategy -> user.role
      const userRole = user.role?.name;
      if (!requiredRoles.includes(userRole)) {
        throw new ForbiddenException('Access denied: invalid role');
      }
    }

    if (requiredPermissions?.length > 0) {
      const rolePermissions =
        //user.role?.role_permissions -> payload on jwtStrategy -> user.role
        user.role?.role_permissions?.map((rp) => rp.permission.name) || [];
      const userPermissions =
        user.user_permissions?.map((up) => up.permission.name) || [];

      
      const allPermissions = new Set([...rolePermissions, ...userPermissions]);

      // <---- The user must have one of the roles, and all of the required permissions (not just one). ---->
      // const hasAllPermissions = requiredPermissions.every((perm) =>
      //   allPermissions.has(perm),
      // );

      // if (!hasAllPermissions) {
      //   throw new ForbiddenException('Access denied: missing permissions');
      // }

      // <---- The user must have one of the roles, and some or just one of the required permissions (not just one). ---->
      const hasSomePermissions = requiredPermissions.some((perm) =>
        allPermissions.has(perm),
      );

      if (!hasSomePermissions) {
        throw new ForbiddenException('Access denied: missing permissions');
      }
    }

    return true;
  }
}
