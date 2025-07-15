import { 
    ACTION_CREATE,
    MODULE_MNGR,  
 } from 'src/Auth/components/decorators/ability.enum';
import { Can } from 'src/Auth/components/decorators/can.decorator';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { RequestUser } from 'src/Auth/components/types/request-user.interface';
import { UserService } from 'src/User/user.service';
import { CreateUserWithTemplateDto } from 'src/User/dto/create-user-with-template.dto';
import { SessionUser } from 'src/Auth/components/decorators/session-user.decorator';
import { SM_MANAGER } from 'src/Auth/components/constants/core-constants';

@Controller('manager')
export class ManagerController {
    constructor( private userService: UserService) {}

    //<<<<------- THE CONTROL ROUTES INTENDED FOR IT MANAGER -------> 

    @Post('users')
    @Can({
        action: ACTION_CREATE,
        subject: SM_MANAGER.USER_ACCOUNT,
        module: [MODULE_MNGR] // or MODULE_HR if it's from Admin
    })
    async createUserManager(
        @Body() createUserWithTemplateDto: CreateUserWithTemplateDto,
        @SessionUser() user: RequestUser,
    ) {
    return this.userService.createUserEmployee(createUserWithTemplateDto, user);
    }

    @Post('users')
    @Can({
        action: ACTION_CREATE,
        subject: SM_MANAGER.USER_ACCOUNT,
        module: [MODULE_MNGR] // or MODULE_HR if it's from Admin
    })     
    async newResetToken(
        @Body() body: { email: string },
        @SessionUser() user: RequestUser,
    ) {
        return this.userService.userNewResetToken(body.email, user);
    }
}