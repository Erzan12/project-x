import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreatePersonDto } from '../person/dto/create-person.dto';
import { CreateCompanyDto } from 'src/administrator/Company/dto/create-company.dto';

@Injectable()
export class EmployeeService {
    constructor (private prisma: PrismaService) {}

    async createEmployee( createPersonDto: CreatePersonDto, createEmployeeDto: CreateEmployeeDto) {

        // Step 1: Create the Person
        const person = await this.prisma.person.create({
            data : {
                first_name: createPersonDto.first_name,
                middle_name: createPersonDto.last_name,
                last_name: createPersonDto.last_name,
                date_of_birth: new Date(createPersonDto.date_of_birth),
                gender: createPersonDto.gender,
                civil_status: createPersonDto.civil_status,
                // optionally add gender, nationality, etc. if available in DTO
            },
        });

        const company = await this.prisma.company.findUnique({
            where: { id: createEmployeeDto.company_id },
        });
        if (!company) {
            throw new BadRequestException('Invalid company_id');
        }

        const department = await this.prisma.department.findUnique({
            where: { id: createEmployeeDto.department_id },
        });
        if (!department) {
            throw new BadRequestException('Invalid department_id');
        }


        // Step 2: Create the Employee
        const employee = await this.prisma.employee.create({
            data : {
                company_id: createEmployeeDto.company_id,     // to be adjusted dto can be added if experiencing an error
                person_id: person.id,
                employee_id: createEmployeeDto.employee_id,
                department_id: createEmployeeDto.department_id,
                hire_date: new Date(createEmployeeDto.hire_date),
                position: createEmployeeDto.position,
                salary: createEmployeeDto.salary,
                pay_frequency:  createEmployeeDto.pay_frequency,
                employment_status: createEmployeeDto.employment_status,
                monthly_equivalent_salary: createEmployeeDto.monthly_equivalent_salary,
                corporate_rank_id: createEmployeeDto.corporate_rank_id,
            },
            // include: {
            //     company: true,
            // }
        });
        return { message: 'Employee created', employee };
    }
}
