import { 
    ACTION_CREATE,
    MODULE_MNGR,  
 } from 'src/Auth/components/decorators/ability';
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


}