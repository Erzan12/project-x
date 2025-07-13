import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
// import { CanCreateUserGuard } from "src/Auth/guards/can-user-guard";
import { PermissionsGuard } from "src/Auth/guards/permissions.guard";

export const Authenticated = () => UseGuards(AuthGuard('jwt'), PermissionsGuard); // dry guardlogic for jwt token and auth