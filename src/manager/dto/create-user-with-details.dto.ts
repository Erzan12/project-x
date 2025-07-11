// import { Type } from "class-transformer";
// import { CreateUserAccountDto } from "./create-user-account.dto";
// // import { CreatePermissionTemplateDto } from "src/Administrator/dto/create-permission-template.dto";
// import {
//     IsInt,
//     IsNotEmpty,
// } from 'class-validator';

// export class CreateUserWithTemplateDto {
//     @IsNotEmpty()
//     @Type(() => CreateUserAccountDto)
//     user_details: CreateUserAccountDto;

//     @IsInt()
//     @IsNotEmpty()
//     user_permission_template_id: number;

//     @IsInt()
//     @IsNotEmpty()
//     module_id: number;
// }