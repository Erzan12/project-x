import { IsNotEmpty, IsInt } from "class-validator";

export class AddPermissionToExistingUserDto {
    @IsInt({ each: true})
    @IsNotEmpty()
    user_id: number;

    @IsInt()
    @IsNotEmpty()
    permission_template_id: number;
}