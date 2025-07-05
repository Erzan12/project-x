import { CreatePersonDto } from "src/HR/Person/dto/create-person.dto";
import { CreateEmployeeDto } from "./create-employee.dto";
import { Type } from "class-transformer";
import { IsDateString, ValidateNested,  } from "class-validator";

export class CreateEmployeeWithDetailsDto {
    
    //wrapper dto for nested dto

    @ValidateNested()
    @Type(() => CreatePersonDto)
    person: CreatePersonDto;

    @ValidateNested()
    @Type(() => CreateEmployeeDto)
    employee: CreateEmployeeDto;

    @IsDateString()
    hire_date: string;

}