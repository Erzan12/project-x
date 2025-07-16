import { Controller,Post, Body, Put, Delete } from '@nestjs/common';
import { ModuleService } from './module.service';
import { Can } from 'src/Auth/components/decorators/can.decorator';
import { ACTION_CREATE, MODULE_ADMIN } from 'src/Auth/components/decorators/ability';
import { SM_ADMIN } from 'src/Auth/components/constants/core-constants';
import { SessionUser } from 'src/Auth/components/decorators/session-user.decorator';
import { RequestUser } from 'src/Auth/components/types/request-user.interface';
import { CreateModuleDto } from './dto/create-module.dto';

@Controller('administrator')
export class ModuleController {
    constructor(private moduleService: ModuleService) {}

    @Post('module')                                                                       
    @Can({
        action: ACTION_CREATE,
        subject: SM_ADMIN.CORE_MODULE.MODULE,
        module: [MODULE_ADMIN],
    })
    async createModule( 
        @Body() createModuleDto: CreateModuleDto,
        @SessionUser() user: RequestUser                                                            // to make enum decorator
        ) {
        return this.moduleService.createModule(createModuleDto, user)
    }

    // @Put()
    // async updateModule({

    // })

    // @Delete()
    // async deleteModule({

    // })
}
