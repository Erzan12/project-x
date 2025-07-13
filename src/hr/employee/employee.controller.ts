import { Controller, Post, Body, ValidationPipe, UsePipes } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeWithDetailsDto } from './dto/create-employe-with-details.dto';
import { Roles } from 'src/Auth/components/decorators/roles.decorator';
import { Can } from '../../Auth/components/decorators/can.decorator';
import {
  ACTION_CREATE,
  SM_EMPLOYEE_MASTERLIST,
  MODULE_HR,
  MODULE_ACCOUNTING,
} from '../../Auth/components/decorators/ability.enum';

@Controller('hr')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('employee-create')
  @Can({
          action: ACTION_CREATE,
          subject: SM_EMPLOYEE_MASTERLIST,
          module: [MODULE_ACCOUNTING] // or MODULE_HR if it's from Admin
  })
  @UsePipes(new ValidationPipe ({whitelist:true})) //to global in maints or appmodule
  async createEmployee(@Body() createDto: CreateEmployeeWithDetailsDto) {
    const { person, employee, hire_date } = createDto;
    return this.employeeService.createEmployee( person, employee, new Date(hire_date) );
  } 
}


