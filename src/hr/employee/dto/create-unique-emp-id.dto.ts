import { 
    IsString,
    IsNotEmpty
 } from "class-validator";

export class CreateUniqueEmp {
    @IsString()
    @IsNotEmpty()
    company_id: number;

    @IsString()
    @IsNotEmpty()
    hire_date: string;

}