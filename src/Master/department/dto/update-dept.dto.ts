import { Expose, Transform } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateDeptInfoDto {
    @IsInt()
    @IsNotEmpty()
    department_id: number;

    @IsString()
    @IsNotEmpty()
    department_name: string;

    @Expose()
    @IsBoolean()
    @Transform(({ obj }) => obj.status ? 'Active' : 'Inactive')
    status?: boolean;
}