import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../components/decorators/public.decorator';
import { CaslAbilityService } from '../../casl/casl.service';
import { PERMISSIONS_KEY, PermissionMetadata } from '../components/decorators/can.decorator';

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
    const user = request.user;

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

    const userModule = user.module;

    const userModuleName = userModule?.name;

    const hasModuleAccess = Array.isArray(permission.module)
      ? permission.module.includes(userModuleName)
      : userModuleName === permission.module;

    this.logger.debug(`User module name: ${userModule?.name}`);
    this.logger.debug(`Allowed modules: ${permission.module}`);

    this.logger.debug(`Checking module access for user ID ${user.id}, module ID: ${user.module?.id}`);

    if (!hasModuleAccess) {
      throw new ForbiddenException(
        `Access denied: your module (ID: ${userModule?.id}, Name: ${userModule?.name}) is not allowed to perform this action.`,
      );
    }

    const { action, subject, module } = permission;

    const ability = this.caslAbilityService.defineAbilitiesFor(user.role);

    const canAccess = ability.can(action, subject);

    this.logger.debug(
      `Checking role "${user.role}" -> ${action} on ${subject} (Module: ${module})`,
    );

    const role = user.role;

    for (const perm of role.role_permissions) {
      console.log(`Allowed: ${perm.action} on ${perm.permission?.name}`);
    }

    if (!canAccess) {
      throw new ForbiddenException(`You do not have permission to ${action} ${subject}`);
    }

    return true;
  }
}