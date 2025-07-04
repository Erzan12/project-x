// sample/protected.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/components/decorators/roles.decorator';
import { Permissions } from 'src/auth/components/decorators/permissions.decorator';
import { RolesPermissionsGuard } from 'src/auth/guards/roles-permissions.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('protected')
@UseGuards(AuthGuard('jwt'), RolesPermissionsGuard)
export class ProtectedController {
  @Get('hr-only')
  @Roles('Human Resources')
  @Permissions('View Employee', 'Add Employee')
  getHrData() {
    return { message: 'HR Access Granted' };
  }

  @Get('it-only')
  @Roles('Information Technology')
  @Permissions('Approve Ticket')
  getItData() {
    return { message: 'IT Access Granted' };
  }
}
