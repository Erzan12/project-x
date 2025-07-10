import { Controller, Post, Body, ValidationPipe, UsePipes } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeWithDetailsDto } from './dto/create-employe-with-details.dto';
import { Roles } from 'src/Auth/components/decorators/roles.decorator';
import { Permissions } from 'src/Auth/components/decorators/permissions.decorator';

@Controller('hr')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('employee-create')
  @Roles('Human Resources')
  @Permissions('view')
  @UsePipes(new ValidationPipe ({whitelist:true}))
  async createEmployee(@Body() createDto: CreateEmployeeWithDetailsDto) {
    const { person, employee, hire_date } = createDto;
    return this.employeeService.createEmployee( person, employee, new Date(hire_date) );
  } 
}


