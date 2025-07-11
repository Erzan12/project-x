import { IsString, IsNotEmpty, IsInt, IsBoolean } from 'class-validator';

export class CreateDepartmentDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsInt()
    division_id: number;

    @IsBoolean()
    status: string;
}