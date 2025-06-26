import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreatePersonDto } from '../users/dto/create-person.dto';
// import { RegisterDto } from './dto/register.dto'; // to be added later

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    // @Post('register')
    // @UsePipes(new ValidationPipe ({whitelist:true}))
    // async register(@Body() dto: CreatePersonDto) {
    //     // TODO: Replace 0 with the actual user ID of the creator, e.g., from the request context
    //     return this.usersService.createUser(dto, 0);
    // }
}

