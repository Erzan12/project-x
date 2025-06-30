import { Controller, Post, Body, ValidationPipe, UsePipes, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeWithDetailsDto } from '../employee/dto/create-employe-with-details.dto';
// import { Roles } from '../../auth/common/decorators/roles.decorator'; // adjust path as needed
// import { Role } from '../../auth/common/decorators/enum.decorator';
// import { RolesGuard } from 'src/auth/common/guards/roles-permission.guard';

@Controller('hr')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // @UseGuards(RolesGuard)
  @Post('employee-create')
  @UsePipes(new ValidationPipe ({whitelist:true}))
  // @Roles(Role.HR_ADMIN) // optional: only HR can access this
  async createEmployee(@Body() createDto: CreateEmployeeWithDetailsDto) {
    return this.employeeService.createEmployee( createDto.person, createDto.employee );
  }
}

    // @Post('create')
    // // @Roles('Human Resources') // optional: only HR can access this
    // create(@Body() body: CreateEmployeeWithDetailsDto) {
    //     return this.employeeService.createEmployee(
    //         body.employee,
    //         body.person,
    //         body.company,
    //     );
    // }

