import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreatePersonDto } from 'src/users/dto/create-person.dto';

@Injectable()
export class EmployeeService {
    constructor (private prisma: PrismaService) {}

    async createEmployee(createEmployeeDto: CreateEmployeeDto, createPersonDto: CreatePersonDto) {

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

        // Step 2: Create the Employee

        const employee = await this.prisma.employee.create({
            data : {
                company_id: co,     // to create company dto
                person_id: person.id,
                employee_id: createEmployeeDto.employee_id,
                department_id: createEmployeeDto.employee_id,
                hire_date: new Date(createEmployeeDto.hire_date),
                position: createEmployeeDto.position,
                salary: createEmployeeDto.salary,
                pay_frequency:  createEmployeeDto.pay_frequency,
                employment_status: createEmployeeDto.employment_status,
                monthly_equivalent_salary: createEmployeeDto.monthly_equivalent_salary,
                corporate_rank_id: createEmployeeDto.corporate_rank_id,
            },
            // include: {
            //     person: true;    no need to include person because its in the same method
            // }
        });
        return { message: 'Employee created', employee };
    }
}
