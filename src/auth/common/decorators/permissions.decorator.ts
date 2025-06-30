import { SetMetadata } from "@nestjs/common";
import { Permission } from "./enum.decorator";

export const PERMISSION_KEY = 'permissioms'; 
export const Permissions = (...permissions: string[]) => SetMetadata('PERMISSION_KEY', permissions);

