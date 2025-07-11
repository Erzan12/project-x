import { Body, Controller, Post, UsePipes, ValidationPipe, Req, ForbiddenException, UseGuards } from '@nestjs/common';
import { RequestWithUser } from 'src/Auth/components/interfaces/request-with-user.interface';
import { Roles } from 'src/Auth/components/decorators/roles.decorator';
import { Permissions } from 'src/Auth/components/decorators/permissions.decorator';
import { Actions } from 'src/Auth/components/decorators/global.enums';
import { Role } from 'src/Auth/components/decorators/global.enums';
import { UserService } from './user.service';
import { CreateUserWithTemplateDto } from './dto/create-user-with-template.dto';
import { canUserCreateAccounts } from 'src/Auth/components/commons/permissions/create-user-permission.helper';
import { CanCreateUserGuard } from 'src/Auth/guards/can-user-guard';

@Controller('api/manager')
export class UserController {
    constructor( private userService: UserService ) {}

    //<<<<------- THE CONTROL ROUTES INTENDED FOR IT MANAGER -------> 

    // @Post('user-create')
    // @Roles()
    // //can enable allPermissions because its now centralized for Information Technology
    // @Permissions(Actions.CREATE)
    // @UsePipes(new ValidationPipe ({whitelist:true}))
    // async createUser(
    //     @Body() createUserWithTemplateDto: CreateUserWithTemplateDto,
    //     @Req() req: RequestWithUser,
    // ) {
    //     // const { user_details, user_permission_template_id, module_id } = createUserWithTemplateDto
    //     return this.userService.createUserEmployee( createUserWithTemplateDto, req);
    // }

    // using can-guard
    @UseGuards(CanCreateUserGuard)
    @Post('user-create')
    @Permissions(Actions.CREATE)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async createUser(
    @Body() createUserWithTemplateDto: CreateUserWithTemplateDto,
    @Req() req: RequestWithUser,
    ) {
    return this.userService.createUserEmployee(createUserWithTemplateDto, req);
    }

    //alternative can-guard
    // @Post('user-create')
    // @Permissions(Actions.CREATE)
    // @UsePipes(new ValidationPipe({ whitelist: true }))
    // async createUser(
    // @Body() createUserWithTemplateDto: CreateUserWithTemplateDto,
    // @Req() req: RequestWithUser,
    // ) {
    // if (!canUserCreateAccounts(req.user.role)) {
    //     throw new ForbiddenException('Not authorized to create users');
    // }

    // return this.userService.createUserEmployee(createUserWithTemplateDto, req);
    // }

    @Post('new-token')
    @Roles()    //to make enums
    @Permissions('Approve ticket')      
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