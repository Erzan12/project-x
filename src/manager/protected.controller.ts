// sample/protected.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/Auth/components/decorators/roles.decorator';
import { Permissions } from 'src/Auth/components/decorators/permissions.decorator';
import { RolesPermissionsGuard } from 'src/Auth/guards/roles-permissions.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('protected')
export class ProtectedController {
  @Get('authorized-only')
  @Roles('Human Resources', 'Accounting', 'Information Technology')
  @Permissions('view')
  getHrData() {
    return { message: 'Authorize Access Granted' };
  }
}
