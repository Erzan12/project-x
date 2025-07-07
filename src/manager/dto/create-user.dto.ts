import {
    IsNotEmpty,
    IsString,
    MinLength,
    IsEmail,
    IsInt,
    IsArray,
    ArrayNotEmpty,
} from 'class-validator';

export class CreateUserAccountDto {
    // @IsNotEmpty()
    // employee_id: string;
    @IsNotEmpty()
    employee_id: string;
    
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsInt()
    @IsNotEmpty()
    department_id: number;

    @IsInt()
    @IsNotEmpty()
    role_id: number;

    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    company_ids: number[];

    @IsNotEmpty()
    template_ids: number;
}