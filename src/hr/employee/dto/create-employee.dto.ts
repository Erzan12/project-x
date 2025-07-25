import {
    IsInt,
    IsNotEmpty,
    IsOptional
} from 'class-validator';

export class CreateEmployeeDto {
    
    @IsInt()
    @IsNotEmpty()
    company_id: number;

    @IsInt()
    @IsNotEmpty()
    department_id: number;

    @IsInt()
    @IsNotEmpty()
    position_id: number;

    @IsInt()
    @IsNotEmpty()
    salary: number;

    @IsNotEmpty()
    pay_frequency: string;

    @IsNotEmpty()
    employment_status_id: number;
    
    @IsInt()
    @IsNotEmpty()
    monthly_equivalent_salary: number;

    @IsOptional()
    archive_date: string;

    @IsOptional()
    other_employee_data: string;

    @IsInt()
    @IsNotEmpty()
    corporate_rank_id: number;
}