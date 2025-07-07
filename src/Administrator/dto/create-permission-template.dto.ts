import {
    IsString,
    IsInt,
    IsNotEmpty,
    IsArray,
    ArrayNotEmpty
} from 'class-validator';

export class CreatePermissionTemplateDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @IsNotEmpty()
    departmentId: number;

    @IsArray()
    @ArrayNotEmpty()
    @IsNotEmpty()
    @IsInt({ each: true }) //validate each item in array is an integer
    companyIds: number[];

    @IsArray()
    @ArrayNotEmpty()
    rolePermissionIds: { role_id: number, permission_id: number, module_id: number }[];
}