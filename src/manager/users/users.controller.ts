import { Body, Controller, Post, UsePipes, ValidationPipe, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../../manager/users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesPermissionsGuard } from 'src/auth/guards/roles-permissions.guard';
import { Roles } from 'src/auth/components/decorators/roles.decorator';
import { Permissions } from 'src/auth/components/decorators/permissions.decorator';
import { RequestWithUser } from 'src/auth/components/interfaces/request-with-user.interface';

@Controller('registration')
@UseGuards(AuthGuard('jwt'), RolesPermissionsGuard)
export class AuthController {
    constructor(private readonly usersService: UsersService) {}

    @Post('user-create')
    @Roles('Information Technology','Human Resources')
    // applied some instead of all permissions so that as long as there is 1 permission intended for a role user-register will not be denied
    @Permissions('Approve Ticket', 'Add Employee')
    @UsePipes(new ValidationPipe ({whitelist:true}))
    async createUser(
        @Body() createUserDto: CreateUserDto,
        @Req() req: RequestWithUser,    
    ) {
        const createdBy = req.user.id;
        return this.usersService.createUserEmployee(createUserDto, createdBy);
    }
    
    @Post('new-token')
    @Roles('Information Technology','Human Resources')
    // applied some instead of all permissions so that as long as there is 1 permission intended for a role user-register will not be denied
    @Permissions('Approve Ticket', 'Add Employee')
    @UsePipes(new ValidationPipe ({whitelist:true}))
    async newResetToken(@Body()  body: { email: string }) {
        return this.usersService.userNewResetToken(body.email);
    }
}
