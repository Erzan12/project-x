import { IsString, IsNotEmpty, IsInt, IsBoolean } from 'class-validator';

export class CreatePositionDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsInt()
    department_id: number;

    @IsBoolean()
    status: string;
}