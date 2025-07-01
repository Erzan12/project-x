import { Body, Controller, Post, Query, UseGuards, Req, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../manager/users/users.service';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordWithTokenDto } from './dto/reset-password-with-token-dto';
// import { Roles } from './common/decorators/roles.decorator';
// import { RolesPermissionsGuard } from './common/guards/roles-permission.guard';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

    // @UseGuards(RolesPermissionsGuard)
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('reset-password')
    async passwordResetWithToken(
        @Query('token') token: string,
        @Body() dto: ResetPasswordWithTokenDto,
        ) {
        return this.authService.resetPasswordWithToken(dto, token);
    }
}

