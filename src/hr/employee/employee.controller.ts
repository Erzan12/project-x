import {
  ACTION_CREATE,
  MODULE_HR,
} from '../../Auth/components/decorators/ability.enum';
import { Controller, Post, Body, Get, ValidationPipe, UsePipes } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeWithDetailsDto } from './dto/create-employe-with-details.dto';
import { Can } from '../../Auth/components/decorators/can.decorator';
import { SM_HR } from 'src/Auth/components/constants/core-constants';

@Controller('hr')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('employee-create')
  @Can({
        action: ACTION_CREATE,
        subject: SM_HR.EMPLOYEE_MASTERLIST,
        module: [MODULE_HR]
  })
  async createEmployee(@Body() createDto: CreateEmployeeWithDetailsDto) {
    const { person, employee, hire_date } = createDto;
    return this.employeeService.createEmployee( person, employee, new Date(hire_date) );
  }
}


