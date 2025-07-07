import { Body, Controller, Post, UsePipes, ValidationPipe, Req } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { CreateUserAccountDto } from './dto/create-user.dto';
import { RequestWithUser } from 'src/Auth/components/interfaces/request-with-user.interface';
import { Roles } from 'src/Auth/components/decorators/roles.decorator';
import { Permissions } from 'src/Auth/components/decorators/permissions.decorator';
import { Authenticated } from 'src/Auth/components/decorators/auth-guard.decorator';

// @Controller('registration')
// @Authenticated()
// export class ManagerController {
//     constructor(private readonly managerService: ManagerService) {}

//     @Post('user-create')
//     @Roles('Information Technology','Human Resources')
//     // applied some instead of all permissions so that as long as there is 1 permission intended for a role user-register will not be denied
//     @Permissions('Approve Ticket', 'Add Employee')
//     @UsePipes(new ValidationPipe ({whitelist:true}))
//     async createUser(
//         @Body() createUserDto: CreateUserAccountDto,
//         @Req() req: RequestWithUser,    
//     ) {
//         const created_by = req.user.id;
//         return this.managerService.createUserEmployeeWithTemplate(createUserDto, created_by);
//     }
    
//     @Post('new-token')
//     @Roles('Information Technology','Human Resources')
//     // applied some instead of all permissions so that as long as there is 1 permission intended for a role user-register will not be denied
//     @Permissions('Approve Ticket', 'Add Employee')
//     @UsePipes(new ValidationPipe ({whitelist:true}))
//     async newResetToken(@Body()  body: { email: string }) {
//         return this.managerService.userNewResetToken(body.email);
//     }
// }

@Controller('api/it-manager')
@Authenticated()
export class ITManController {
    constructor( private managerService: ManagerService) {}

    //<<<<------- THE CONTROL ROUTES INTENDED FOR IT MANAGER -------> 
    @Post('user-create')
    @Roles('Information Technology')
    //can enable allPermissions because its now centralized for Information Technology
    @Permissions('approve')
    @UsePipes(new ValidationPipe ({whitelist:true}))
    async createUser(
        @Body() createUserDto: CreateUserAccountDto,
        @Req() req: RequestWithUser,
    ) {
        const createdBy = req.user.id;
        return this.managerService.createUserEmployeeWithTemplate(createUserDto, createdBy);
    }

    @Post('new-token')
    @Roles('Information Technology')
    @Permissions('Approve ticket')
    @UsePipes(new ValidationPipe ({whitelist:true}))
    async newResetToken(@Body() body: { email: string }) {
        return this.managerService.userNewResetToken(body.email);
    }
}

@Controller('api/hr-manager')
@Authenticated()
export class HRManController {
    constructor(private managerService: ManagerService) {}

    //<<<<------- THE CONTROL ROUTES INTENDED FOR HR MANAGER ------->
    @Post('user-create')
    @Roles('Human Resources')
    // @Permissions('Add Employee')
    @UsePipes(new ValidationPipe ({whitelist:true}))
    async createUser(
        @Body() createUserDto: CreateUserAccountDto,
        @Req() req: RequestWithUser,
    ) {
        const createdBy = req.user.id;
        return this.managerService.createUserEmployeeWithTemplate(createUserDto, createdBy);
    }

    // @Post('new-token')
    // @Roles('Human Resources')
    // @Permissions('Add Employee')
}

@Controller('api/accounting-manager')
@Authenticated()
export class ACCManController {
    constructor(private managerService: ManagerService) {}


    //<<<<------- THE CONTROL ROUTES INTENDED FOR ACCOUNTING MANAGER -------> 
}

@Controller('api/operations-manager')
@Authenticated()
export class OPSManController {
    
    //<<<<------- THE CONTROL ROUTES INTENDED FOR OPERATIONS MANAGER -------> 
}

@Controller('api/payroll-manager')
@Authenticated()
export class PRMANController {

    //<<<<------- THE CONTROL ROUTES INTENDED FOR PAYROLL MANAGER -------> 
}

@Controller('api/inventory-manager')
@Authenticated()
export class INMANController {

    //<<<<------- THE CONTROL ROUTES INTENDED FOR INVENTORY MANAGER -------> 
}

@Controller('api/purchasing-manager')
@Authenticated()
export class PRCController {

    //<<<<------- THE CONTROL ROUTES INTENDED FOR PURCHASING MANAGER -------> 
}

@Controller('api/finance-manager')
@Authenticated()
export class FINManController {

    //<<<<------- THE CONTROL ROUTES INTENDED FOR FINANCIAL MANAGER -------> 
}

@Controller('api/asst-manager')
@Authenticated()
export class ASTManController {

    //<<<<------- THE CONTROL ROUTES INTENDED FOR ASSET MANAGER -------> 
}

@Controller('api/compliance-manager')
@Authenticated()
export class CPLManController {

    //<<<<------- THE CONTROL ROUTES INTENDED FOR COMPLIANCE MANAGER -------> 
}

//eportal -> admin