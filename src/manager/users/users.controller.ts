import { Body, Controller, Post, UsePipes, ValidationPipe, Request, UseGuards } from '@nestjs/common';
import { UsersService } from '../../manager/users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateEmployeeDto } from '../../hr/employee/dto/create-employee.dto';
// import { JwtCustomModule } from 'src/auth/middleware/jwt.module';
import { AuthGuard } from '@nestjs/passport';
import { RolesPermissionsGuard } from 'src/auth/guards/roles-permissions.guard';

@Controller('registration')
export class AuthController {
    constructor(private readonly usersService: UsersService) {}

    @Post('user-register')
    @UsePipes(new ValidationPipe ({whitelist:true}))
    // @UseGuards(AuthGuard('jwt'), RolesPermissionsGuard)
    async createUser(@Body() dto: CreateUserDto) {
        // TODO: Replace 0 with the actual user ID of the creator, e.g., from the request context
    return this.usersService.createUserEmployee(dto, 0);
    }         
}