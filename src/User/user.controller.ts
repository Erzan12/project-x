import { Body, Controller, Post, UsePipes, ValidationPipe, Req, ForbiddenException, UseGuards } from '@nestjs/common';
import { RequestWithUser } from 'src/Auth/components/interfaces/request-with-user.interface';
import { UserService } from './user.service';
import { CreateUserWithTemplateDto } from './dto/create-user-with-template.dto';
import { Roles } from 'src/Auth/components/decorators/roles.decorator';
import { Can } from '../Auth/components/decorators/can.decorator';
import {
  ACTION_CREATE,
  SM_USER_ACCOUNT,
  MODULE_MNGR,
  MODULE_ADMIN,
  ACTION_MANAGE,
} from '../Auth/components/decorators/ability.enum';

@Controller('api/manager')
export class UserController {
    constructor( private userService: UserService ) {}

    //<<<<------- THE CONTROL ROUTES INTENDED FOR IT MANAGER -------> 

    // CAN DECORATOR PERMISSION AND ROLE HANDLING -> PERMISSIONGUARD -> CASLSERVICE
    @Post('user-create')
    @Can({
        action: ACTION_CREATE,
        subject: SM_USER_ACCOUNT,
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async createUser(
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
    @UsePipes(new ValidationPipe ({whitelist:true}))
    async newResetToken(@Body() body: { email: string }) {
        return this.userService.userNewResetToken(body.email);
    }
}

@Controller('api/hr-manager')
export class HRManController {
    constructor( private userService: UserService ) {}

    //<<<<------- THE CONTROL ROUTES INTENDED FOR HR MANAGER ------->
    // @Post('user-create')
    // @Roles('Human Resources')
    // // @Permissions('Add Employee')
    // @UsePipes(new ValidationPipe ({whitelist:true}))
    // async createUser(
    //     @Body() createUserDto: CreateUserAccountDto,
    //     @Req() req: RequestWithUser,
    // ) {
    //     const createdBy = req.user.id;
    //     return this.managerService.createUserEmployee(createUserAccountDto,createUserWithTemplateDto, req);
    // }

    // @Post('new-token')
    // @Roles('Human Resources')
    // @Permissions('Add Employee')
}

@Controller('api/accounting-manager')
export class ACCManController {
    constructor( private userService: UserService ) {}


    //<<<<------- THE CONTROL ROUTES INTENDED FOR ACCOUNTING MANAGER -------> 
}

@Controller('api/operations-manager')
export class OPSManController {
    
    //<<<<------- THE CONTROL ROUTES INTENDED FOR OPERATIONS MANAGER -------> 
}

@Controller('api/payroll-manager')
export class PRMANController {

    //<<<<------- THE CONTROL ROUTES INTENDED FOR PAYROLL MANAGER -------> 
}

@Controller('api/inventory-manager')
export class INMANController {

    //<<<<------- THE CONTROL ROUTES INTENDED FOR INVENTORY MANAGER -------> 
}

@Controller('api/purchasing-manager')
export class PRCController {

    //<<<<------- THE CONTROL ROUTES INTENDED FOR PURCHASING MANAGER -------> 
}

@Controller('api/finance-manager')
export class FINManController {

    //<<<<------- THE CONTROL ROUTES INTENDED FOR FINANCIAL MANAGER -------> 
}

@Controller('api/asst-manager')
export class ASTManController {

    //<<<<------- THE CONTROL ROUTES INTENDED FOR ASSET MANAGER -------> 
}

@Controller('api/compliance-manager')
export class CPLManController {

    //<<<<------- THE CONTROL ROUTES INTENDED FOR COMPLIANCE MANAGER -------> 
}

//eportal -> admin