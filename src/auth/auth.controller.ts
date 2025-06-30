import { Body, Controller, Post, Query, UseGuards, Req, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../manager/users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreatePersonDto } from '../hr/person/dto/create-person.dto';
import { ResetPasswordWithTokenDto } from './dto/reset-password-with-token-dto';
// import { Roles } from './common/decorators/roles.decorator'; // adjust path as needed
// import { Role } from './common/decorators/enum.decorator';
// import { RolesPermissionsGuard } from './common/guards/roles-permission.guard';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

    // @UseGuards(RolesPermissionsGuard)
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    // @Post('reset-password')
    // async passwordReset(@Body() resetDto: ResetPasswordDto) {
    //     return this.authService.passwordReset(resetDto);
    // }

    @Post('reset-password')
    async passwordResetWithToken(
        @Query('token') token: string,
        @Body() dto: ResetPasswordWithTokenDto,
        ) {
        return this.authService.resetPasswordWithToken(dto, token);
    }

    // @Post('register')
    // @UsePipes(new ValidationPipe ({whitelist:true}))
    // async register(@Body() dto: CreatePersonDto) {
    //     // TODO: Replace 0 with the actual user ID of the creator, e.g., from the request context
    //     return this.usersService.createUser(dto, 0);
    // }
}

