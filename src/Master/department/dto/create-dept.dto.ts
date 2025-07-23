import { Expose, Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsInt, IsBoolean } from 'class-validator';

export class CreateDepartmentDto {
    @Expose()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Expose()
    @IsNotEmpty()
    @IsInt()
    division_id: number;

    @Expose()
    @IsBoolean()
    @Transform(({ obj }) => obj.status ? 'Active' : 'Inactive')
    status: boolean;
}