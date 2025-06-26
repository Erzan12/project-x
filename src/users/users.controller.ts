import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreatePersonDto } from './dto/create-person.dto';
// import { RegisterDto } from './dto/register.dto'; // to be added later

@Controller('admin')
export class AuthController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/user-register')
    @UsePipes(new ValidationPipe ({whitelist:true}))
    async register(@Body() dto: CreatePersonDto) {
        // TODO: Replace 0 with the actual user ID of the creator, e.g., from the request context
        return this.usersService.createUser(dto, 0);
    }
}