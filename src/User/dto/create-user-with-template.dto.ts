import {
    IsNotEmpty,
    IsInt,
    ValidateNested,
    IsArray,
    ArrayNotEmpty
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserDetailsDto } from './user-details.dto';

export class CreateUserWithTemplateDto {

    @Type(() => UserDetailsDto)
    @ValidateNested()
    @IsNotEmpty()
    user_details: UserDetailsDto;

    @IsInt({ each: true })
    @IsArray()
    @ArrayNotEmpty()
    @IsNotEmpty()
    user_permission_template_ids: number[];

    @IsInt()
    @IsNotEmpty()
    role_id: number;

    @IsInt()
    @IsNotEmpty()
    module_id: number;
}