import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PermissionsGuard } from "src/Auth/guards/permissions.guard";

export const Authenticated = () => UseGuards(AuthGuard('jwt'), PermissionsGuard); // guardlogic for jwt token and auth