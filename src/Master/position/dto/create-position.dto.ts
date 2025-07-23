import { Expose, Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsInt, IsBoolean } from 'class-validator';

export class CreatePositionDto {
    @Expose()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Expose()
    @IsNotEmpty()
    @IsInt()
    department_id: number;

    @Expose()
    @IsBoolean()
    @Transform(({ obj }) => obj.status ? 'Active' : 'Inactive')
    status: string;
}