import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityService } from '../../casl/casl.service';
import { IS_PUBLIC_KEY } from '../components/decorators/public.decorator';
import {
  PERMISSIONS_KEY,
  PermissionMetadata,
} from '../components/decorators/can.decorator';
import { RequestUser } from '../components/types/request-user.interface';
import { ACTION_MAP, VALID_ACTIONS } from '../components/constants/action-map';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityService: CaslAbilityService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as RequestUser;

    if (!user) {
      throw new ForbiddenException('Please login to access this resource.');
    }

    const permission = this.reflector.get<PermissionMetadata>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    if (!permission) {
      this.logger.warn('No @Permissions metadata found – denying access.');
      throw new ForbiddenException('Access denied: no permission metadata.');
    }

    //handles module for Modules like Administrator or Human Resources, in can permission guard vs db driven data or input
    const userModule = user.module?.name?.toLowerCase().trim();
    const allowedModules = Array.isArray(permission.module)
      ? permission.module.map((m) => m.toLowerCase().trim())
      : [permission.module?.toLowerCase().trim()];

    if (!allowedModules.includes(userModule)) {
      throw new ForbiddenException(
        `Access denied: your module (${userModule}) is not allowed.`,
      );
    }

    //handles the action AKA actual permission and subject AKA submodule,in can permission guard vs db driven data or input
    const action = permission.action.toLowerCase().trim();
    const subject = permission.subject.toLowerCase().trim();

    //validator that throws an error if the action used in the @Can() decorator:
    //Is not in your predefined list (enum or array); Or doesn't exist in the role’s actual permission records
    const ability = this.caslAbilityService.defineAbilitiesFor(user.role);

    this.logger.debug(
      `Checking role "${user.role.name}" -> ${action} on ${subject} (Module: ${userModule})`,
    );

    if (!VALID_ACTIONS.includes(action)) {
      throw new ForbiddenException(
        `Invalid action "${action}" used in @Can(). Please check if it's a supported permission.`
      );
    }

    //cross-check the action in @Can() against only what's defined in the user’s DB permissions
    const definedActions = new Set(
      user.role.role_permissions
        .filter((p) => p.status)
        .map((p) => p.action.toLowerCase().trim())
    );

    if (!definedActions.has(action) && !Object.keys(ACTION_MAP).includes(action)) {
      throw new ForbiddenException(
        `The action "${action}" is not assigned to your role or not valid.`
      );
    }

    // Debug: print all user permissions
    for (const perm of user.role.role_permissions) {
      const pAction = perm.action.toLowerCase();
      const pSubject = perm.permission?.name?.toLowerCase();
      this.logger.debug(`Allowed: ${pAction} on ${pSubject}`);
    }

    //handles the action AKA actual permission and subject AKA submodule,in can permission guard vs db driven data or input
    const canAccess = ability.can(action, subject);

    if (!canAccess) {
      throw new ForbiddenException(
        `You do not have permission to ${action} ${subject}`,
      );
    }

    return true;
  }
}

// import {
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
//   Logger
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { IS_PUBLIC_KEY } from '../components/decorators/public.decorator';
// import { CaslAbilityService } from '../../casl/casl.service';
// import { PERMISSIONS_KEY, PermissionMetadata } from '../components/decorators/can.decorator';
// import { RequestUser } from '../components/types/request-user.interface';

// @Injectable()
// export class PermissionsGuard implements CanActivate {
//   private readonly logger = new Logger(PermissionsGuard.name);

//   constructor(
//     private readonly reflector: Reflector,
//     private readonly caslAbilityService: CaslAbilityService,
//   ) {}

//   canActivate(context: ExecutionContext): boolean {
//     const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);

//     if (isPublic) return true;

//     // const request = context.switchToHttp().getRequest();
//     // const user = request.user as RequestUser;

//     const user: RequestUser = context.switchToHttp().getRequest().user;

//     if (!user) {
//       throw new ForbiddenException('Please login to access this resource.');
//     }

//     const permission = this.reflector.get<PermissionMetadata>(
//       PERMISSIONS_KEY,
//       context.getHandler(),
//     );

//     if (!permission) {
//       this.logger.warn('No @Permissions metadata found – denying access.');
//       throw new ForbiddenException('Access denied: no permission metadata.');
//     }

//     const userModule = user.module;

//     const userModuleName = userModule?.name;

//     const hasModuleAccess = Array.isArray(permission.module)
//       ? permission.module.includes(userModuleName)
//       : userModuleName === permission.module;

//     this.logger.debug(`User module name: ${userModule?.name}`);
//     this.logger.debug(`Allowed modules: ${permission.module}`);

//     this.logger.debug(`Checking module access for user ID ${user.id}, module ID: ${user.module?.id}`);

//     if (!hasModuleAccess) {
//       throw new ForbiddenException(
//         `Access denied: your module (ID: ${userModule?.id}, Name: ${userModule?.name}) is not allowed to perform this action.`,
//       );
//     }

//     const { action, subject, module } = permission;

//     const ability = this.caslAbilityService.defineAbilitiesFor(user.role);

//     const canAccess = ability.can(action, subject);

//     this.logger.debug(
//       `Checking role "${user.role}" -> ${action} on ${subject} (Module: ${module})`,
//     );

//     const role = user.role;

//     for (const perm of role.role_permissions) {
//       console.log(`Allowed: ${perm.action} on ${perm.permission?.name}`);
//     }
    

//     if (!canAccess) {
//       throw new ForbiddenException(`You do not have permission to ${action} ${subject}`);
//     }

//     return true;
//   }
// }