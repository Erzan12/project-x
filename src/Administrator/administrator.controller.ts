import { Body, Controller, Post, Req, Patch, Get, ValidationPipe, UsePipes } from '@nestjs/common';
import { AdministratorService } from '../Administrator/administrator.service';
import { Authenticated } from 'src/Auth/components/decorators/auth-guard.decorator';
import { CreateModuleDto } from '../Administrator/dto/create-module.dto';
import { RequestWithUser } from 'src/Auth/components/interfaces/request-with-user.interface';
import { Roles } from 'src/Auth/components/decorators/roles.decorator';
// import { Permissions } from 'src/Auth/components/decorators/permissions.decorator';
import { CreateSubModuleDto } from './dto/create-sub-module.dto';
import { CreateSubModulePermissionDto } from './dto/create-sub-module-permissions.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import { CreatePermissionTemplateDto } from './dto/create-permission-template.dto';
import { Can } from '../Auth/components/decorators/can.decorator';
import {
  ACTION_CREATE,
  ACTION_READ,
  SM_USER_ACCOUNT,
  MODULE_MNGR,
  MODULE_ADMIN,
  ACTION_UPDATE,
} from '../Auth/components/decorators/ability.enum';
import { AddPermissionToExistingUserDto } from './dto/add-permission-template-existing-user-dto';


@Controller('administrator')
export class AdministratorController {
    constructor (private administratorService: AdministratorService) {}

    @Get('dashboard')                                                                           
    // @Roles('Administrator')
    @Can({
        action: ACTION_READ,
        subject: SM_USER_ACCOUNT,
        module: [MODULE_MNGR, MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    @UsePipes(new ValidationPipe ({ whitelist:true, forbidNonWhitelisted: true}))               //whilelist -> Strips properties not in DTO; forbidNonWhitelisted -> Throws error for properties not in DTO
    getAdminData() {
        return { message: 'Admin Access Granted' };
    }

    @Patch('assign-permission-template')
    @Can({
        action: ACTION_CREATE,
        subject: SM_USER_ACCOUNT,
        module: [MODULE_MNGR, MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    async assignPermissionTemplate( 
        @Body() addPermissionTemplateDto: AddPermissionToExistingUserDto,                                                         // to make enum decorator
     ) {
        return this.administratorService.assignPermissionTemplate(addPermissionTemplateDto)
    }

    @Post('create-module')                                                                       
    @Roles('Administrator')                                                                     // to make enum decorator
    // @Permissions('add')                                                                         // to make enum decorator
    @UsePipes(new ValidationPipe ({ whitelist:true, forbidNonWhitelisted: true}))               //whilelist -> Strips properties not in DTO; forbidNonWhitelisted -> Throws error for properties not in DTO
    async createModule( 
        @Body() createModuleDto: CreateModuleDto,
        @Req() req: RequestWithUser,                                                            // to make enum decorator
     ) {
        const created_by = req.user.id;
        return this.administratorService.createModule(createModuleDto, req, created_by)
    }

    @Post('create-submodule')                                                                         
    @Roles('Administrator')
    // @Permissions('add')
    @UsePipes(new ValidationPipe ({ whitelist:true, forbidNonWhitelisted: true }))              //whilelist -> Strips properties not in DTO; forbidNonWhitelisted -> Throws error for properties not in DTO
    async createSubModule( 
        @Body() createSubModuleDto: CreateSubModuleDto,
        @Req() req: RequestWithUser,                                                            //to make decorator
     ) {
        const created_by = req.user.id;
        return this.administratorService.createSubModule(createSubModuleDto, req, created_by)
    }

    @Post('create-submodule-permissions')                                                                        
    @Roles('Administrator')
    // @Permissions('add')
    @UsePipes(new ValidationPipe ({ whitelist:true, forbidNonWhitelisted: true}))               //whilelist -> Strips properties not in DTO; forbidNonWhitelisted -> Throws error for properties not in DTO
    async createSubModulePermission( 
        @Body() createSubModulePermissionDto: CreateSubModulePermissionDto,
        @Req() req: RequestWithUser,
     ) {
        const created_by = req.user.id;
        return this.administratorService.createSubModulePermissions(createSubModulePermissionDto,req, created_by)
    }

    @Post('create-role')                                                                          
    @Can({
        action: ACTION_CREATE,
        subject: SM_USER_ACCOUNT,
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    @UsePipes(new ValidationPipe ({ whitelist:true, forbidNonWhitelisted: true }))              //whilelist -> Strips properties not in DTO; forbidNonWhitelisted -> Throws error for properties not in DTO
    async createRole(
        @Body() createRoleDto: CreateRoleDto,
        @Req() req: RequestWithUser,
    ) {
        const created_by = req.user.id;
        return this.administratorService.createRole(createRoleDto, req, created_by)
    }

    @Post('create-role-permission')                                                            
    @Can({
        action: ACTION_CREATE,
        subject: SM_USER_ACCOUNT,
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    @UsePipes(new ValidationPipe ({ whitelist:true, forbidNonWhitelisted: true }))               //whilelist -> Strips properties not in DTO; forbidNonWhitelisted -> Throws error for properties not in DTO
    async createRolePermission(
        @Body() createRolePermissionDto: CreateRolePermissionDto,
        @Req() req : RequestWithUser,
    ) {
        const created_by = req.user;
        return this.administratorService.createRolePermissions(createRolePermissionDto, req, created_by)
    }

    @Patch('roles/permissions')                                                                           
    @Roles('Administrator')
    // @Permissions('add')                                                                         
    @UsePipes(new ValidationPipe ({ whitelist:true, forbidNonWhitelisted: true }))              //whilelist -> Strips properties not in DTO; forbidNonWhitelisted -> Throws error for properties not in DTO
    async updateRolePermission( 
        @Body() updateRolePermissionsDto: UpdateRolePermissionsDto,
        @Req() req: RequestWithUser,
    ) {
        return this.administratorService.updateRolePermissions(updateRolePermissionsDto, req);
    }

    @Post('permission-templates')
    @Can({
        action: ACTION_CREATE,
        subject: SM_USER_ACCOUNT,
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    @UsePipes(new ValidationPipe ({ whitelist:true, forbidNonWhitelisted: true }))   
    async create(@Body() dto: CreatePermissionTemplateDto, @Req() req: RequestWithUser) {
    // const created_by = req.user.id;
    return this.administratorService.createPermissionTemplate(dto,req);
    }

    @Patch('update-role-permission')
    @Can({
        action: ACTION_CREATE,
        subject: SM_USER_ACCOUNT,
        module: [MODULE_MNGR, MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    async updateRolePermissions( 
        @Body() updateRolePermissionsDto: UpdateRolePermissionsDto,
        @Req() req: RequestWithUser,                                                         // to make enum decorator
     ) {
        return this.administratorService.updateRolePermissions(updateRolePermissionsDto, req)
    }

    
}
