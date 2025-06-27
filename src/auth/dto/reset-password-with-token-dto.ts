import { IsNotEmpty, MinLength } from "class-validator";

export class ResetPasswordWithTokenDto {
    // @IsNotEmpty()
    // userId: number;
    // token:string;
    
    @MinLength(8, { message: 'Password must be atleast 8 characters long'})
    newPassword: string;
}