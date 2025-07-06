import {
    IsNotEmpty,
    IsString,
    IsNumber,
} from 'class-validator';

export class CreateCompanyDto {
    @IsNumber()
    @IsNotEmpty()
    company_id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    abbreviation: string;

}