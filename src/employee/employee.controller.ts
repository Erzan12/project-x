import { Controller, Post } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {
    constructor (private readonly employeeService : EmployeeService) {}

    // @Post('create')
    // @UseGuards(RolesGuard)
    // @Roles('Human Resources') // optional: only HR can access this
    // async createEmployee(@Body() dto: CreateEmployeeDto) {
    //     return this.employeeService.createEmployee(dto);
    // }
}
