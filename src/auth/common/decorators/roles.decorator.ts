import { SetMetadata } from "@nestjs/common";
import { Role } from "./enum.decorator"; //adjust as you needed

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata('ROLES_KEY', roles);


