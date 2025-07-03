import { CreatePersonDto } from "src/hr/person/dto/create-person.dto";
import { CreateEmployeeDto } from "./create-employee.dto";
import { Type } from "class-transformer";
import { IsDateString, IsNotEmpty, ValidateNested,  } from "class-validator";

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