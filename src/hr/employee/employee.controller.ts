import { Controller, Post, Body, ValidationPipe, UsePipes } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeWithDetailsDto } from './dto/create-employe-with-details.dto';
import { Roles } from 'src/Auth/components/decorators/roles.decorator';
import { Permissions } from 'src/Auth/components/decorators/permissions.decorator';
import { Authenticated } from 'src/Auth/components/decorators/auth-guard.decorator';

@Controller('hr')
@Authenticated()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // @UseGuards(RolesGuard)
  @Post('employee-create')
  @Roles('Human Resources')
  @Permissions('Add Employee')
  @UsePipes(new ValidationPipe ({whitelist:true}))

  async createEmployee(@Body() createDto: CreateEmployeeWithDetailsDto) {
    const { person, employee, hire_date } = createDto;
    return this.employeeService.createEmployee( person, employee, new Date(hire_date) );
  }

  // async createEmployee(@Body() body: any) {
  //   const { createPersonDto, createEmployeeDto, hire_date } = body;
  //   return this.employeeService.createEmployee( createPersonDto, createEmployeeDto, new Date(hire_date) );
  // }
  
}


