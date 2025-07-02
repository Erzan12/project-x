import { Controller, Post, Body, ValidationPipe, UsePipes, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeWithDetailsDto } from '../employee/dto/create-employe-with-details.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesPermissionsGuard } from 'src/auth/guards/roles-permissions.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Permissions } from 'src/auth/decorators/permissions.decorator';

@Controller('hr')
@UseGuards(AuthGuard('jwt'), RolesPermissionsGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // @UseGuards(RolesGuard)
  @Post('employee-create')
  @Roles('Human Resources')
  @Permissions('Add Employee')
  @UsePipes(new ValidationPipe ({whitelist:true}))
  
  async createEmployee(@Body() createDto: CreateEmployeeWithDetailsDto) {
    return this.employeeService.createEmployee( createDto.person, createDto.employee );
  }
}


