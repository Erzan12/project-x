import {
  ACTION_CREATE,
  MODULE_ADMIN,
  MODULE_HR,
} from '../../Auth/components/decorators/ability';
import { Controller, Post, Body, Get, ValidationPipe, UsePipes } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeWithDetailsDto } from './dto/create-employe-with-details.dto';
import { Can } from '../../Auth/components/decorators/can.decorator';
import { SM_HR } from 'src/Auth/components/constants/core-constants';
import { SessionUser } from 'src/Auth/components/decorators/session-user.decorator';
import { RequestUser } from 'src/Auth/components/types/request-user.interface';

@Controller('hr')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('employees')
  @Can({
        action: ACTION_CREATE,
        subject: SM_HR.EMPLOYEE_MASTERLIST,
        module: [MODULE_HR]
  })
  async createEmployee(
    @Body() createDto: CreateEmployeeWithDetailsDto,
    @SessionUser() user: RequestUser,
  ) {
    const { person, employee } = createDto;
    return this.employeeService.createEmployee( person, employee,  user);
  }

  // @Get('employees')
  // @Can({
  //       action: ACTION_CREATE,
  //       subject: SM_HR.EMPLOYEE_MASTERLIST,
  //       module: [MODULE_HR]
  // })
  // async viewEmployees(
  //   @SessionUser() user: RequestUser,
  // ) {
  //   return this.employeeService.viewEmployeeMasterlist(user)
  // }
}


