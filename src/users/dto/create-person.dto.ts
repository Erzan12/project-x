import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';

export class CreatePersonDto {
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsOptional()
    middle_name?: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsNotEmpty()
    @IsString()
    date_of_birth: string;

    @IsString()
    gender: string;

    @IsString()
    civil_status: string;
}