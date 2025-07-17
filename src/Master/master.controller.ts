import { Body, Controller, Post, Req } from '@nestjs/common';
import { PositionService } from './position/position.service';
import { CreatePositionDto } from './position/dto/create-position.dto';
import { CreateDepartmentDto } from './department/dto/create-dept.dto';
import { RequestUser } from 'src/Auth/components/types/request-user.interface';
import { DepartmentService } from './department/department.service';
import { SessionUser } from 'src/Auth/components/decorators/session-user.decorator';
import { Can } from 'src/Auth/components/decorators/can.decorator';
import { ACTION_CREATE, MODULE_ADMIN } from 'src/Auth/components/decorators/ability';
import { subject } from '@casl/ability';
import { SM_ADMIN } from 'src/Auth/components/constants/core-constants';

@Controller('master')
export class MasterController {
    constructor(private positionService: PositionService, private departmentService: DepartmentService) {} 

    @Post('position')
    @Can({
        action: ACTION_CREATE,
        subject: SM_ADMIN.MASTER_TABLE,
        module: [MODULE_ADMIN]
    })
    async createPosition(
        @Body() createDto: CreatePositionDto, 
        @SessionUser() user: RequestUser,
    ) {
        return this.positionService.createPosition( createDto, user);
    }

    @Post('department')
    // @Permissions(Actions.CREATE)
    async createDepartment(
        @Body() createDto: CreateDepartmentDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.departmentService.createDepartment( createDto, user);
    }
}
