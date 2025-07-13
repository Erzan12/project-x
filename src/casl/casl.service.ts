import { 
    AbilityBuilder,
    AbilityClass,
    PureAbility,
} from '@casl/ability';
import { Role } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CaslAbilityService {
  private Ability: AbilityClass<any>;

  constructor() {
    this.Ability = PureAbility as any;
  }

  defineAbilitiesFor(role: Role & { role_permissions: { action: string, permission: { name: string }, status: boolean }[] }) {
    const { can, cannot, build } = new AbilityBuilder(this.Ability);

    /**
   * Defines user abilities dynamically based on the role's permissions stored in the database.
   * 
   * How it works:
   * - Reads all active permissions (action + subject) assigned to the user's role from the DB.
   * - Uses CASL's `can` method to grant those permissions dynamically.
   * - This means any new permission added in the DB (e.g. 'approve', 'verify', 'delete') 
   *   will automatically be applied without needing to update enums or code.
   * - The controller uses the @Can decorator with constants (e.g. ACTION_CREATE) to declare required permissions.
   * - The PermissionsGuard reads these decorators and checks against the abilities defined here.
   * - This setup centralizes permission logic and allows flexible, data-driven access control.
   */

    //CASL Ability Definition - dynamically check the role via controller and CASL service + permission guard
    // ACTION_CREATE, ETC will be automatically be recognize and check as long the user itself has a role_permission of create or else it will return error
    //the ability.enum.ts file is still useful for consistency and typo checks as it is called in the controller
    if (role.role_permissions && role.role_permissions.length > 0) {
      for (const perm of role.role_permissions) {
        if (perm.status) {
          const action = perm.action;
          const subject = perm.permission?.name ?? '';
          can(action, subject);
        }
      }
    }

    return build();
  }
}
