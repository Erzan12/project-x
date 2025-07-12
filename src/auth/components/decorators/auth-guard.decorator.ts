import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
// import { CanCreateUserGuard } from "src/Auth/guards/can-user-guard";
import { RolesPermissionsGuard } from "src/Auth/guards/roles-permissions.guard";

export const Authenticated = () => UseGuards(AuthGuard('jwt'), RolesPermissionsGuard); // dry guardlogic for jwt token and auth