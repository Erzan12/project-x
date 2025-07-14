import { 
    ACTION_CREATE,
    SM_USER_ACCOUNT,
    MODULE_MNGR,
    ACTION_MANAGE    
 } from 'src/Auth/components/decorators/ability.enum';
import { Can } from 'src/Auth/components/decorators/can.decorator';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { RequestWithUser } from 'src/Auth/components/interfaces/request-with-user.interface';
import { UserService } from 'src/User/user.service';
import { CreateUserWithTemplateDto } from 'src/User/dto/create-user-with-template.dto';

@Controller('manager')
export class ManagerController {
    constructor( private userService: UserService) {}

    //<<<<------- THE CONTROL ROUTES INTENDED FOR IT MANAGER -------> 

    @Post('manager')
    @Can({
        action: ACTION_CREATE,
        subject: SM_USER_ACCOUNT,
        module: [MODULE_MNGR] // or MODULE_HR if it's from Admin
    })
    async createUserManager(
    @Body() createUserWithTemplateDto: CreateUserWithTemplateDto,
    @Req() req: RequestWithUser,
    ) {
    return this.userService.createUserEmployee(createUserWithTemplateDto, req);
    }

    @Post('new-token')
    @Can({
        action: ACTION_CREATE,
        subject: SM_USER_ACCOUNT,
        module: [MODULE_MNGR] // or MODULE_HR if it's from Admin
    })     
    async newResetToken(@Body() body: { email: string }) {
        return this.userService.userNewResetToken(body.email);
    }
}