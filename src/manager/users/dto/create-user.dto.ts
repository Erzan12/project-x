import {
    IsNotEmpty,
    IsString,
    MinLength,
    IsEmail,
    IsNumber,
} from 'class-validator';

export class CreateUserDto {
    // @IsNotEmpty()
    // employee_id: string;
    @IsNotEmpty()
    employee_id: string;
    
    @IsEmail()
    email:string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    username: string;

    @IsNotEmpty()
    role_id: number;
}