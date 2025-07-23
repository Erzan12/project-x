import { Body, Controller, Post, Patch, Query, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PositionService } from './position/position.service';
import { CreatePositionDto } from './position/dto/create-position.dto';
import { CreateDepartmentDto } from './department/dto/create-dept.dto';
import { RequestUser } from 'src/Auth/components/types/request-user.interface';
import { DepartmentService } from './department/department.service';
import { SessionUser } from 'src/Auth/components/decorators/session-user.decorator';
import { Can } from 'src/Auth/components/decorators/can.decorator';
import { ACTION_CREATE, ACTION_READ, ACTION_UPDATE, MODULE_ADMIN } from 'src/Auth/components/decorators/ability';
import { subject } from '@casl/ability';
import { SM_ADMIN } from 'src/Auth/components/constants/core-constants';
import { UpdateDeptInfoDto } from './department/dto/update-dept.dto';

@Controller('mastertables')
export class MasterController {
    constructor(private positionService: PositionService, private departmentService: DepartmentService) {} 

    @Post('position')
    @Can({
        action: ACTION_CREATE,
        subject: SM_ADMIN.MASTER_TABLE_POSITION,
        module: [MODULE_ADMIN]
    })
    async createPosition(
        @Body() createDto: CreatePositionDto, 
        @SessionUser() user: RequestUser,
    ) {
        return this.positionService.createPosition( createDto, user);
    }

    @Post('department')
    @Can({
        action: ACTION_CREATE,
        subject: SM_ADMIN.MASTER_TABLE_DEPARTMENT,
        module: [MODULE_ADMIN]
    })
    async createDepartment(
        @Body() createDepartmentDto: CreateDepartmentDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.departmentService.createDepartment( createDepartmentDto, user);
    }

    @Patch('department')
    @Can({
        action: ACTION_UPDATE,
        subject: SM_ADMIN.MASTER_TABLE_DEPARTMENT,
        module: [MODULE_ADMIN],
    })
    async updateDept(
        @Body() updateDeptInfoDto: UpdateDeptInfoDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.departmentService.updateDeptInfo( updateDeptInfoDto, user)
    }

    @Patch('department/status')
    @Can({
        action: ACTION_UPDATE,
        subject: SM_ADMIN.MASTER_TABLE_DEPARTMENT,
        module: [MODULE_ADMIN],
    })
    async deactivateDept(
        @Body() updateDeptInfoDto: UpdateDeptInfoDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.departmentService.deactivateDept( updateDeptInfoDto, user )
    }

    @Patch('department/status')
    @Can({
        action: ACTION_UPDATE,
        subject: SM_ADMIN.MASTER_TABLE_POSITION,
        module: [MODULE_ADMIN],
    })
    async reactivateDept(
        @Body() updateDeptInfoDto: UpdateDeptInfoDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.departmentService.reactivateDept( updateDeptInfoDto, user )
    }

    @Get('departments')
    @Can({
        action: ACTION_READ,
        subject: SM_ADMIN.MASTER_TABLE_POSITION,
        module: [MODULE_ADMIN],
    })
    async getDepartments(
        @SessionUser() user: RequestUser,
        @Query('status') status?: string,
    ) {
        return this.departmentService.getDepartments(user, status);
    }
}
