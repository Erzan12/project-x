import {
  ACTION_CREATE,
  ACTION_READ,
  MODULE_MNGR,
  MODULE_ADMIN,
  ACTION_UPDATE,
  ACTION_ACCESS
} from '../Auth/components/decorators/ability';
import { AddPermissionToExistingUserDto } from './role/dto/add-permission-template-existing-user-dto';
import { CreateUserWithTemplateDto } from 'src/User/dto/create-user-with-template.dto';
import { UserService } from 'src/User/user.service';
import { Body, Controller, Post, Req, Patch, Get } from '@nestjs/common';
import { AdministratorService } from '../Administrator/administrator.service';
import { CreateModuleDto } from './module/dto/create-module.dto';
import { RequestUser } from 'src/Auth/components/types/request-user.interface';
import { CreateSubModuleDto } from './sub_module/dto/create-sub-module.dto';
import { CreateSubModulePermissionDto } from './sub_module/dto/create-sub-module-permissions.dto';
import { CreateRoleDto } from './role/dto/create-role.dto';
import { CreateRolePermissionDto } from './role/dto/create-role-permission.dto';
import { UpdateRolePermissionsDto } from './role/dto/update-role-permissions.dto';
import { CreatePermissionTemplateDto } from './role/dto/create-permission-template.dto';
import { Can } from '../Auth/components/decorators/can.decorator';
import { SessionUser } from 'src/Auth/components/decorators/session-user.decorator';
import { SM_ADMIN } from 'src/Auth/components/constants/core-constants';
import { ModuleService } from './module/module.service';

@Controller('administrator')
export class AdministratorController {
    // constructor (private administratorService: AdministratorService, private userService: UserService, private moduleService: ModuleService) {}

    //load dashboard
    @Get('dashboard')                                                                           
    // @Roles('Administrator') -> applied via permission guard and casl service
    @Can({
        action: ACTION_READ,  // the action of the subtion will be match with the current user role permission
        subject: SM_ADMIN.DASHBOARD, // SUBMODULE of Module Admin
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    getAdminData(@SessionUser() user: RequestUser) {
        console.log('Current User:', user)
        return { message: 'Admin Dashboard Access Granted', };
        // return this.userService.createUserEmployee(createUserWithTemplateDto, user);
    }

    @Get('audit_trail')                                                                           
    // @Roles('Administrator') -> applied via permission guard and casl service
    @Can({
        action: ACTION_READ,  // the action of the subtion will be match with the current user role permission
        subject: SM_ADMIN.AUDIT_TRAIL, // SUBMODULE of Module Admin
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    getAuditTrail() {
        return { message: 'Admin Audit Access Granted' };
    }

    @Get('db_encoding')                                                                           
    // @Roles('Administrator') -> applied via permission guard and casl service
    @Can({
        action: ACTION_READ,  // the action of the subtion will be match with the current user role permission
        subject: SM_ADMIN.DB_ENCONDING, // SUBMODULE of Module Admin
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    getDBEncoding() {
        return { message: 'Admin DB Encoding Access Granted' };
    }
    
    @Get('db_manual_query')                                                                           
    // @Roles('Administrator') -> applied via permission guard and casl service
    @Can({
        action: ACTION_READ,  // the action of the subtion will be match with the current user role permission
        subject: SM_ADMIN.DB_MANUAL_QUERY, // SUBMODULE of Module Admin
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    getDBManualQuery() {
        return { message: 'Admin DB Manual Query Access Granted' };
    }

    @Get('module')                                                                           
    // @Roles('Administrator') -> applied via permission guard and casl service
    @Can({
        action: ACTION_READ,  // the action of the subtion will be match with the current user role permission
        subject: SM_ADMIN.CORE_MODULE.MODULE, // SUBMODULE of Module Admin
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    getModule() {
        return { message: 'Admin Module Access Granted' };
    }

    @Get('sub_module')                                                                           
    // @Roles('Administrator') -> applied via permission guard and casl service
    @Can({
        action: ACTION_READ,  // the action of the subtion will be match with the current user role permission
        subject: SM_ADMIN.CORE_MODULE.SUB_MODULE, // SUBMODULE of Module Admin
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    getSubModule() {
        return { message: 'Admin SubModule Access Granted' };
    }

    @Get('role')                                                                           
    // @Roles('Administrator') -> applied via permission guard and casl service
    @Can({
        action: ACTION_READ,  // the action of the subtion will be match with the current user role permission
        subject: SM_ADMIN.CORE_MODULE.ROLE, // SUBMODULE of Module Admin
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    getRole() {
        return { message: 'Admin Role Access Granted' };
    }

    @Get('maintenance_schedule')                                                                           
    // @Roles('Administrator') -> applied via permission guard and casl service
    @Can({
        action: ACTION_READ,  // the action of the subtion will be match with the current user role permission
        subject: SM_ADMIN.MAINTENANCE_SCHEDULE, // SUBMODULE of Module Admin
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    getMaintenanceSched() {
        return { message: 'Admin Maintenance Sched Access Granted' };
    }

    @Get('master_table')                                                                           
    // @Roles('Administrator') -> applied via permission guard and casl service
    @Can({
        action: ACTION_READ,  // the action of the subtion will be match with the current user role permission
        subject: SM_ADMIN.MASTER_TABLE, // SUBMODULE of Module Admin
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    getMasterTable() {
        return { message: 'Admin Master Table Access Granted' };
    }

    @Get('users')                                                                           
    // @Roles('Administrator') -> applied via permission guard and casl service
    @Can({
        action: ACTION_READ,  // the action of the subtion will be match with the current user role permission
        subject: SM_ADMIN.USER_ACCOUNT, // SUBMODULE of Module Admin
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    getUserAccount() {
        return { message: 'Admin User Accounts Access Granted' };
    }

    @Get('user_token_key')                                                                           
    // @Roles('Administrator') -> applied via permission guard and casl service
    @Can({
        action: ACTION_READ,  // the action of the subtion will be match with the current user role permission
        subject: SM_ADMIN.USER_TOKEN_KEY, // SUBMODULE of Module Admin
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    getUserTokenKey() {
        return { message: 'Admin User Token Key Access Granted' };
    }

    @Get('sms_subscription')                                                                           
    // @Roles('Administrator') -> applied via permission guard and casl service
    @Can({
        action: ACTION_READ,  // the action of the subtion will be match with the current user role permission
        subject: SM_ADMIN.SMS_SUBSCRIPTION, // SUBMODULE of Module Admin
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    getSMSSubscription() {
        return { message: 'Admin SMS Subscription Access Granted' };
    }

    @Get('user_summary')                                                                           
    // @Roles('Administrator') -> applied via permission guard and casl service
    @Can({
        action: ACTION_READ,  // the action of the subtion will be match with the current user role permission
        subject: SM_ADMIN.REPORT.USER_SUMMARY, // SUBMODULE of Module Admin
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    getUserSummary() {
        return { message: 'Admin User Summary Access Granted' };
    }

    @Get('user_login_history')                                                                           
    // @Roles('Administrator') -> applied via permission guard and casl service
    @Can({
        action: ACTION_READ,  // the action of the subtion will be match with the current user role permission
        subject: SM_ADMIN.REPORT.USER_LOGIN_HISTORY, // SUBMODULE of Module Admin
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    getUserLoginHistory() {
        return { message: 'Admin User Log In History Access Granted' };
    }
}
