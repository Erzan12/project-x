//STABLE 
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../components/decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../components/decorators/permissions.decorator';
import { PrismaService } from '../../../prisma/prisma.service'// adjust to your actual import
import { IS_PUBLIC_KEY } from '../components/decorators/public.decorator';

@Injectable()
export class RolesPermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    //added public decorator in authcustom guard for @Public Routes ->decorators->public.decorator.ts
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No user found in request');
    }

    //map for role and user permissions
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        role: {
          include: {
            role_permissions: {
              include: {
                permission: {
                  include: {
                    permissions: true,
                    module: true,
                  }
                }
              }
            }
          },
        },
        user_permissions: {
          include: {
            user_role: true,
            user: {
              include: {
                role: true,
              }
            },
            companies: true,
          },
        },
      },
    });

        //map for role and user permissions
    // const dbUser = await this.prisma.user.findUnique({
    //   where: { id: user.id },
    //   include: {
    //     role: {
    //       include: {
    //         role_permissions: {
    //           include: { permission: true },
    //         },
    //       },
    //     },
    //     user_permissions: {
    //       include: { permission: true },
    //     },
    //   },
    // });

    console.log('Decoded JWT user object:', request.user);

    if (!dbUser) {
      throw new ForbiddenException('User not found in database');
    }

    console.log('Required Roles:', requiredRoles);
    console.log('User Role:', dbUser.role?.name);

    console.log('🔐 Current rolePermissions:', dbUser.role?.role_permissions);
    console.log('🔐 Current userPermissions:', dbUser.user_permissions);

    if (requiredRoles?.length > 0) {
      const userRole = dbUser.role?.name;
      if (!userRole || !requiredRoles.includes(userRole)) {
        throw new ForbiddenException('Access denied: invalid role');
      }
    }

    if (requiredPermissions?.length > 0) {

      const rolePermissions =
      //remove permission in rp.permission.action because action is in the role_permissions field and we need to call or map the action field for the permission
      dbUser.role?.role_permissions.map((rp) => rp.action) || [];
      const userPermissions =
      //mapping of user permission in userpermissions model from assigned permission in role permissions
      dbUser.user_permissions.map((up) => up.user_role_permission) || [];

      const allPermissions = new Set([...rolePermissions, ...userPermissions]);

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


//old ways include role and permission in jwt log in payload
// import {
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { ROLES_KEY } from '../components/decorators/roles.decorator';
// import { PERMISSIONS_KEY } from '../components/decorators/permissions.decorator';

// @Injectable()
// export class RolesPermissionsGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
//       context.getHandler(), context.getClass()]);

//     const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
//       PERMISSIONS_KEY,
//       [context.getHandler(), context.getClass()],
//     );

//     const request = context.switchToHttp().getRequest();
//     const user = request.user;

//     if (!user) {
//       throw new ForbiddenException('No user found in request');
//     }  

//     console.log('Request user:', user);

//     if (requiredRoles?.length > 0) {
//       //user.role?.name -> payload on jwtStrategy -> user.role
//       const userRole = user.role?.name;
//       if (!requiredRoles.includes(userRole)) {
//         throw new ForbiddenException('Access denied: invalid role');
//       }
//     }

//     if (requiredPermissions?.length > 0) {
//       const rolePermissions =
//         //user.role?.role_permissions -> payload on jwtStrategy -> user.role
//         user.role?.role_permissions?.map((rp) => rp.permission.name) || [];
//       const userPermissions =
//         user.user_permissions?.map((up) => up.permission.name) || [];

      
//       const allPermissions = new Set([...rolePermissions, ...userPermissions]);

//       // <---- The user must have one of the roles, and all of the required permissions (not just one). ---->
//       // const hasAllPermissions = requiredPermissions.every((perm) =>
//       //   allPermissions.has(perm),
//       // );

//       // if (!hasAllPermissions) {
//       //   throw new ForbiddenException('Access denied: missing permissions');
//       // }

//       // <---- The user must have one of the roles, and some or just one of the required permissions (not just one). ---->
//       const hasSomePermissions = requiredPermissions.some((perm) =>
//         allPermissions.has(perm),
//       );

//       if (!hasSomePermissions) {
//         throw new ForbiddenException('Access denied: missing permissions');
//       }
//     }

//     return true;
//   }
// }
