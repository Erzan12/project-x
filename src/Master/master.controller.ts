import { Body, Controller, Post, Req } from '@nestjs/common';
import { PositionService } from './position/position.service';
import { CreatePositionDto } from './position/dto/create-position.dto';
import { CreateDepartmentDto } from './department/dto/create-dept.dto';
import { RequestWithUser } from 'src/Auth/components/interfaces/request-with-user.interface';
import { DepartmentService } from './department/department.service';
import { Actions } from 'src/Auth/components/decorators/global.enums.decorator';
import { Permissions } from 'src/Auth/components/decorators/permissions.decorator';

@Controller('master')
export class MasterController {
    constructor(private positionService: PositionService, private departmentService: DepartmentService) {} 

    @Post('position')
    @Permissions(Actions.CREATE)
    async createPosition(@Body() createDto: CreatePositionDto, @Req() req: RequestWithUser) {
        const { name, department_id, status } = createDto
        return this.positionService.createPosition( createDto, req );
    }

    @Post('department')
    @Permissions(Actions.CREATE)
    async createDepartment(@Body() createDto: CreateDepartmentDto, @Req() req: RequestWithUser) {
        const { name, division_id, status } = createDto
        return this.departmentService.createDepartment( createDto, req );
    }
}
