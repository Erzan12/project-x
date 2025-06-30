import {
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateEmployeeDto {
    @IsNotEmpty()
    company_id: number;

    @IsNotEmpty()
    employee_id: string;
    
    @IsNotEmpty()
    @IsString()
    hire_date: string;

    @IsNotEmpty()
    department_id: number;

    @IsNotEmpty()
    position: string;

    @IsNotEmpty()
    salary: number;

    @IsNotEmpty()
    pay_frequency: string;

    @IsNotEmpty()
    employment_status: string;
    
    @IsNotEmpty()
    monthly_equivalent_salary: number;

    @IsOptional()
    archive_date: string;

    @IsOptional()
    other_employee_data: string;

    @IsNotEmpty()
    corporate_rank_id: number;
}