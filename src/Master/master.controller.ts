import { Body, Controller, Post, Req } from '@nestjs/common';
import { PositionService } from './position/position.service';
import { CreatePositionDto } from './position/dto/create-position.dto';
import { CreateDepartmentDto } from './department/dto/create-dept.dto';
import { RequestUser } from 'src/Auth/components/types/request-user.interface';
import { DepartmentService } from './department/department.service';
import { SessionUser } from 'src/Auth/components/decorators/session-user.decorator';

@Controller('master')
export class MasterController {
    constructor(private positionService: PositionService, private departmentService: DepartmentService) {} 

    @Post('position')
    // @Permissions(Actions.CREATE)
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
