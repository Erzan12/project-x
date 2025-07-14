import { Body, Controller, Post, Req } from '@nestjs/common';
import { RequestWithUser } from 'src/Auth/components/interfaces/request-with-user.interface';
import { UserService } from './user.service';
import { CreateUserWithTemplateDto } from './dto/create-user-with-template.dto';
import { Can } from '../Auth/components/decorators/can.decorator';
import {
  ACTION_CREATE,
  SM_USER_ACCOUNT,
  MODULE_MNGR,
  MODULE_ADMIN,
  ACTION_MANAGE,
} from '../Auth/components/decorators/ability.enum';

@Controller()
export class UserController {
    constructor( private userService: UserService ) {}
    //<<<<------- THE CONTROL ROUTES INTENDED FOR MANAGER and ADMINISTRATOR -------> 

    // CAN DECORATOR PERMISSION AND ROLE HANDLING -> PERMISSIONGUARD -> CASLSERVICE
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

    @Post('administrator')
    @Can({
        action: ACTION_CREATE,
        subject: SM_USER_ACCOUNT,
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    async createUserAdministrator(
    @Body() createUserWithTemplateDto: CreateUserWithTemplateDto,
    @Req() req: RequestWithUser,
    ) {
    return this.userService.createUserEmployee(createUserWithTemplateDto, req);
    }

    @Post('new-token')
    @Can({
        action: ACTION_CREATE,
        subject: SM_USER_ACCOUNT,
        module: [MODULE_MNGR, MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })     
    async newResetToken(@Body() body: { email: string }) {
        return this.userService.userNewResetToken(body.email);
    }
}

