import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from '../../manager/users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateEmployeeDto } from '../../hr/employee/dto/create-employee.dto';
import { JwtCustomModule } from 'src/auth/middleware/jwt.module';
import { Roles } from '../../auth/common/decorators/roles.decorator'; // adjust path as needed
import { Role } from '../../auth/common/decorators/enum.decorator';

@Controller('admin')
export class AuthController {
    constructor(private readonly usersService: UsersService) {}

    // @Post('/user-register')
    // @UsePipes(new ValidationPipe ({whitelist:true}))
    // async register(@Body() userDto: CreateUserDto,  employeeDto: CreateEmployeeDto) {
    //     // TODO: Replace 0 with the actual user ID of the creator, e.g., from the request context
    //     return this.usersService.createUser(userDto, employeeDto);
    // }

    // @Post('/user-register')
    // @UsePipes(new ValidationPipe ({whitelist:true}))
    // async register(@Body() userDto: CreateUserDto) {
    //     // TODO: Replace 0 with the actual user ID of the creator, e.g., from the request context
    //     return this.usersService.createUser(userDto, 0);
    // }

    @Post('user-register')
    @UsePipes(new ValidationPipe ({whitelist:true}))
    // @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.IT_ADMIN)
    async createUser(@Body() dto: CreateUserDto) {
        // TODO: Replace 0 with the actual user ID of the creator, e.g., from the request context
    return this.usersService.createUser(dto, 0);
    }       

    // @Post('create')
    // @UseGuards(JwtGuard, RolesGuard) i have set up jwt middleware global for now
}