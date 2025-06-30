// roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../decorators/enum.decorator'; // your enum path

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
        throw new UnauthorizedException('User role not found');
    }

    if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}

// import { 
//     CanActivate, 
//     ExecutionContext, 
//     ForbiddenException, 
//     Injectable } 
// from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { CustomRequest } from 'src/types/custom-request';

// @Injectable()
// export class RolesPermissionsGuard implements CanActivate {
//     constructor(private reflector: Reflector) {} 

//     canActivate(context: ExecutionContext): boolean {
//         const requiredRoles = this.reflector.getAllAndOverride<string[]>(
//             'roles',
//             [context.getHandler(), context.getClass()],
//         );

//         const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
//             'permissions',
//             [context.getHandler(), context.getClass()],

//         );

//         const req = context.switchToHttp().getRequest<CustomRequest>();
//         const user = req.user;

//         if (!user) {
//             throw new ForbiddenException('No user found in request');
//         }

//         // role check
//         if (requiredRoles && requiredRoles.length > 0) {
//             const userRole = user.role?.name;
//             if (!userRole || !requiredRoles.includes(userRole)) {
//                 throw new ForbiddenException('Access denied: insufficient role');
//             }
//         }

//         // permission check
//         if (requiredPermissions && requiredPermissions.length > 0) {
//             const rolePermissions = user.role?.role_permissions?.map(rp => rp.permission.name) || [];
//             const userPermissions = user.user_permissions?.map(up => up.permission.name || []);
//             const allPermissions = new Set([...rolePermissions, ...userPermissions]);

//             const hasAllPermissions = requiredPermissions.every(p => allPermissions.has(p));
//             if (!hasAllPermissions) {
//                 throw new ForbiddenException('Access denied: missing permissions');
//             }
//         }        

//         // TODO: Implement your logic here to check roles and permissions
//         // For now, return true to satisfy the return type
//         return true;
//     }
// }

