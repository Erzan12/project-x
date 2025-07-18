import { Controller, Post, Body } from '@nestjs/common';
import { SM_ADMIN } from 'src/Auth/components/constants/core-constants';
import { ACTION_CREATE, MODULE_ADMIN } from 'src/Auth/components/decorators/ability';
import { Can } from 'src/Auth/components/decorators/can.decorator';
import { CreateSubModuleDto } from './dto/create-sub-module.dto';
import { CreateSubModulePermissionDto } from './dto/create-sub-module-permissions.dto';
import { SessionUser } from 'src/Auth/components/decorators/session-user.decorator';
import { RequestUser } from 'src/Auth/components/types/request-user.interface';
import { SubModuleService } from './sub_module.service';

@Controller('administrator')
export class SubModuleController {
    constructor(private subModuleService: SubModuleService) {}
        //create submodule
        @Post('submodule')                                                                         
        @Can({
            action: ACTION_CREATE,  // the action of the subtion will be match with the current user role permission
            subject: SM_ADMIN.CORE_MODULE_SUB_MODULE, // SUBMODULE of Module Admin
            module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
        })
        async createSubModule( 
            @Body() createSubModuleDto: CreateSubModuleDto,
            @SessionUser() user: RequestUser                                                          //to make decorator
         ) {
            return this.subModuleService.createSubModule(createSubModuleDto, user)
        }
    
        //add submodule permissions
        @Post('submodule/permissions')                                                                        
        @Can({
            action: ACTION_CREATE,  // the action of the subtion will be match with the current user role permission
            subject: SM_ADMIN.CORE_MODULE_SUB_MODULE, // SUBMODULE of Module Admin
            module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
        })
        async createSubModulePermission( 
            @Body() createSubModulePermissionDto: CreateSubModulePermissionDto,
            @SessionUser() user: RequestUser 
         ) {
            return this.subModuleService.createSubModulePermissions(createSubModulePermissionDto, user)
        }
}
