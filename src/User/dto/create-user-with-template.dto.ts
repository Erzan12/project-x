import {
    IsNotEmpty,
    IsInt,
    ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserDetailsDto } from './user-details.dto';

export class CreateUserWithTemplateDto {

    @Type(() => UserDetailsDto)
    @ValidateNested()
    @IsNotEmpty()
    user_details: UserDetailsDto;

    @IsInt()
    @IsNotEmpty()
    user_permission_template_id: number;

    @IsInt()
    @IsNotEmpty()
    module_id: number;
}