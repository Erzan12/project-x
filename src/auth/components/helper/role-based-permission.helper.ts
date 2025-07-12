import { Role } from "../decorators/global.enums.decorator";

export function canUserCreateAccounts(roleName: string): boolean {
    const allowedRoles = [
        Role.ADMINISTRATOR,
        Role.HUMAN_RESOURCES,
        Role.PAYROLL,
        Role.PURCHASING,
        Role.INVENTORY,
        Role.ACCOUNTING,
        Role.OPERATIONS,   
        Role.FINANCE,
        Role.ASSET_MANAGEMENT,
        Role.COMPLIANCE,
        Role.INFORMATION_TECHNOLOGY,
        Role.MANAGERS,
        Role.EPORTAL_USER,
    ];

    return allowedRoles.includes(roleName as Role);
}