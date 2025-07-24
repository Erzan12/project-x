import {
    IsNotEmpty,
    IsInt,
    ValidateNested,
    IsArray,
    ArrayNotEmpty,
} from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { UserDetailsDto } from './user-details.dto';

// export class CreateUserWithTemplateDto {

//     @Type(() => UserDetailsDto)
//     @ValidateNested()
//     @IsNotEmpty()
//     user_details: UserDetailsDto;

//     @IsInt({ each: true })
//     @IsArray()
//     @ArrayNotEmpty()
//     @IsNotEmpty()
//     user_permission_template_ids: number[];

//     @IsInt({ each:true })
//     @IsNotEmpty()
//     @IsArray()
//     @ArrayNotEmpty()
//     role_ids: number[];

//     @IsInt({ each: true })
//     @IsNotEmpty()
//     @IsArray()
//     @ArrayNotEmpty()
//     module_ids: number[];
// }

export class CreateUserWithTemplateDto {
  @ValidateNested()
  user_details: {
    employee_id: string;
    username: string;
    email: string;
    password: string;
  };

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  user_permission_template_ids: number[];
}
