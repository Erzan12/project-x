import { IsNotEmpty, MinLength } from "class-validator";

export class ResetPasswordWithTokenDto {
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be atleast 8 characters long'})
    newPassword: string;
}