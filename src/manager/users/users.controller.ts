import { Body, Controller, Post, UsePipes, ValidationPipe, Request, UseGuards } from '@nestjs/common';
import { UsersService } from '../../manager/users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesPermissionsGuard } from 'src/auth/guards/roles-permissions.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Permissions } from 'src/auth/decorators/permissions.decorator';

@Controller('registration')
@UseGuards(AuthGuard('jwt'), RolesPermissionsGuard)
export class AuthController {
    constructor(private readonly usersService: UsersService) {}

    @Post('user-register')
    @Roles('Information Technology','Human Resources')
    // applied some instead of all permissions so that as long as there is 1 permission intended for a role user-register will not be denied
    @Permissions('Approve Ticket', 'Add Employee')
    @UsePipes(new ValidationPipe ({whitelist:true}))
    async createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUserEmployee(dto, 0);
    }         
}
