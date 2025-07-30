import { Expose, Transform } from "class-transformer";
import { IsNotEmpty, IsInt, IsString, IsBoolean, IsOptional } from "class-validator";

export class UpdatePositionDto {
    @IsInt()
    @IsNotEmpty()
    position_id: number;

    @IsOptional()
    @IsString()
    position_name?: string;

    @IsOptional()
    @IsInt()
    department_id?: number;

    @IsOptional()
    @IsInt()
    @IsNotEmpty()
    stat: number;
}