import {
  ACTION_CREATE,
  ACTION_READ,
  MODULE_MNGR,
  MODULE_ADMIN,
  ACTION_UPDATE,
} from '../Auth/components/decorators/ability.enum';
import { AddPermissionToExistingUserDto } from './dto/add-permission-template-existing-user-dto';
import { CreateUserWithTemplateDto } from 'src/User/dto/create-user-with-template.dto';
import { UserService } from 'src/User/user.service';
import { Body, Controller, Post, Req, Patch, Get, ValidationPipe, UsePipes } from '@nestjs/common';
import { AdministratorService } from '../Administrator/administrator.service';
import { CreateModuleDto } from '../Administrator/dto/create-module.dto';
import { RequestUser } from 'src/Auth/components/types/request-user.interface';
import { CreateSubModuleDto } from './dto/create-sub-module.dto';
import { CreateSubModulePermissionDto } from './dto/create-sub-module-permissions.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import { CreatePermissionTemplateDto } from './dto/create-permission-template.dto';
import { Can } from '../Auth/components/decorators/can.decorator';
import { SessionUser } from 'src/Auth/components/decorators/session-user.decorator';
import { SM_ADMIN } from 'src/Auth/components/constants/core-constants';

@Controller('administrator')
export class AdministratorController {
    constructor (private administratorService: AdministratorService, private userService: UserService) {}

    @Get('dashboard')                                                                           
    // @Roles('Administrator') -> applied via permission guard and casl service
    @Can({
        action: ACTION_READ,  // the action of the subtion will be match with the current user role permission
        subject: SM_ADMIN.DASHBOARD, // SUBMODULE of Module Admin
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    getAdminData() {
        return { message: 'Admin Access Granted' };
    }

    @Post('users')
    @Can({
        action: ACTION_CREATE,
        subject: SM_ADMIN.USER_ACCOUNT,
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    async createUserAdministrator(
    @Body() createUserWithTemplateDto: CreateUserWithTemplateDto,
    @SessionUser() user: RequestUser
    ) {
    return this.userService.createUserEmployee(createUserWithTemplateDto, user);
    }

    @Post('users')
    @Can({
        action: ACTION_CREATE,
        subject: SM_ADMIN.USER_ACCOUNT,
        module: [MODULE_MNGR, MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })     
    async newResetToken(
        @Body() body: { email: string },
        @SessionUser() user: RequestUser,
    ) {
        return this.userService.userNewResetToken(body.email, user);
    }

    @Post('module')                                                                       
    @Can({
        action: ACTION_CREATE,  // the action of the subtion will be match with the current user role permission
        subject: SM_ADMIN.CORE_MODULE.MODULE, // SUBMODULE of Module Admin
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    async createModule( 
        @Body() createModuleDto: CreateModuleDto,
        @SessionUser() user: RequestUser                                                            // to make enum decorator
     ) {
        return this.administratorService.createModule(createModuleDto, user)
    }

    @Post('submodule')                                                                         
    @Can({
        action: ACTION_CREATE,  // the action of the subtion will be match with the current user role permission
        subject: SM_ADMIN.CORE_MODULE.SUB_MODULE, // SUBMODULE of Module Admin
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    async createSubModule( 
        @Body() createSubModuleDto: CreateSubModuleDto,
        @SessionUser() user: RequestUser                                                          //to make decorator
     ) {
        return this.administratorService.createSubModule(createSubModuleDto, user)
    }

    @Post('submodule/permissions')                                                                        
    @Can({
        action: ACTION_CREATE,  // the action of the subtion will be match with the current user role permission
        subject: SM_ADMIN.CORE_MODULE.SUB_MODULE, // SUBMODULE of Module Admin
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    async createSubModulePermission( 
        @Body() createSubModulePermissionDto: CreateSubModulePermissionDto,
        @SessionUser() user: RequestUser 
     ) {
        return this.administratorService.createSubModulePermissions(createSubModulePermissionDto, user)
    }

    @Post('role')                                                                          
    @Can({
        action: ACTION_CREATE,  // the action of the subtion will be match with the current user role permission
        subject: SM_ADMIN.CORE_MODULE.ROLE, // SUBMODULE of Module Admin
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    async createRole(
        @Body() createRoleDto: CreateRoleDto,
        @SessionUser() user: RequestUser 
    ) {
        return this.administratorService.createRole(createRoleDto, user)
    }

    @Post('role_permission')                                                            
    @Can({
        action: ACTION_CREATE,
        subject: SM_ADMIN.CORE_MODULE.ROLE,
        module: [MODULE_ADMIN]
    })       
    async createRolePermission(
        @Body() createRolePermissionDto: CreateRolePermissionDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.administratorService.createRolePermissions(createRolePermissionDto, user)
    }

    // @Patch('update_roles_permissions')                                                                           
    // @Can({
    //     action: ACTION_UPDATE,
    //     subject: SM_ADMIN.CORE_MODULE.ROLE,
    //     module: [MODULE_ADMIN]
    // })                                                                                    //whilelist -> Strips properties not in DTO; forbidNonWhitelisted -> Throws error for properties not in DTO
    // async updateRolePermission( 
    //     @Body() updateRolePermissionsDto: UpdateRolePermissionsDto,
    //     @SessionUser() user: RequestUser,
    // ) {
    //     return this.administratorService.updateRolePermissions(updateRolePermissionsDto, user);
    // }

    @Patch('update_role_permission')
    @Can({
        action: ACTION_UPDATE,
        subject: SM_ADMIN.CORE_MODULE.ROLE,
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    async updateRolePermissions( 
        @Body() updateRolePermissionsDto: UpdateRolePermissionsDto,
        @SessionUser() user: RequestUser,                                                        // to make enum decorator
     ) {
        return this.administratorService.updateRolePermissions(updateRolePermissionsDto, user)
    }

    @Post('permission_templates')
    @Can({
        action: ACTION_CREATE,
        subject: SM_ADMIN.CORE_MODULE.ROLE,
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    async create(
        @Body() dto: CreatePermissionTemplateDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.administratorService.createPermissionTemplate(dto,user);
    }

    @Patch('assign_permission_template')
    @Can({
        action: ACTION_UPDATE,  // the action of the subtion will be match with the current user role permission
        subject: SM_ADMIN.CORE_MODULE.ROLE, // SUBMODULE of Module Admin
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    async assignPermissionTemplate( 
        @Body() addPermissionTemplateDto: AddPermissionToExistingUserDto,                                                         // to make enum decorator
     ) {
        return this.administratorService.assignPermissionTemplate(addPermissionTemplateDto)
    }   
}
