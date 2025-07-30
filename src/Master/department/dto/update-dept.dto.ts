import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateDeptInfoDto {
    @IsInt()
    @IsNotEmpty()
    department_id: number;

    @IsString()
    @IsNotEmpty()
    department_name: string;

    @IsInt()
    @IsNotEmpty()
    stat: number;
}