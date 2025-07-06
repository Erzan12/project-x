import { Body, Controller, Post, Req } from '@nestjs/common';
import { AdministratorService } from '../Administrator/administrator.service';
import { Authenticated } from 'src/Auth/components/decorators/auth-guard.decorator';
import { CreateModuleDto } from '../Administrator/dto/create-module.dto';
import { RequestWithUser } from 'src/Auth/components/interfaces/request-with-user.interface';
import { Roles } from 'src/Auth/components/decorators/roles.decorator';
import { Permissions } from 'src/Auth/components/decorators/permissions.decorator';
import { CreateSubModuleDto } from './dto/create-sub-module.dto';
import { CreateSubModulePermissionDto } from './dto/create-sub-module-permissions.dto';

@Controller('administrator')
export class AdministratorController {
    constructor (private administratorService: AdministratorService) {}

    @Post('create-module')
    @Authenticated()
    @Roles('Administrator')
    // @Permissions('access')
    async createModule( 
        @Body() createModuleDto: CreateModuleDto,
        @Req() req: RequestWithUser,
     ) {
        const created_by = req.user.id;
        return this.administratorService.createModule(createModuleDto, created_by)
    }

    @Post('create-submodule')
    @Authenticated()
    @Roles('Administrator')
    // @Permissions('access')
    async createSubModule( 
        @Body() createSubModuleDto: CreateSubModuleDto,
        @Req() req: RequestWithUser,
     ) {
        const created_by = req.user.id;
        return this.administratorService.createSubModule(createSubModuleDto, created_by)
    }

    @Post('create-submodule-permissions')
    @Authenticated()
    @Roles('Administrator')
    // @Permissions('access')
    async createSubModulePermission( 
        @Body() createSubModulePermissionDto: CreateSubModulePermissionDto,
        @Req() req: RequestWithUser,
     ) {
        const created_by = req.user.id;
        return this.administratorService.createSubModulePermissions(createSubModulePermissionDto, created_by)
    }
}
