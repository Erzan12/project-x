import { IsNotEmpty, IsInt } from "class-validator";

export class AddPermissionToExistingUserDto {
    @IsInt()
    @IsNotEmpty()
    role_id: number;

    @IsInt()
    @IsNotEmpty()
    permission_template_id: number;
}