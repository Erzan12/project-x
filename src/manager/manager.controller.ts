// import { Body, Controller, Post, UsePipes, ValidationPipe, Req } from '@nestjs/common';
// import { ManagerService } from './manager.service';
// import { RequestWithUser } from 'src/Auth/components/interfaces/request-with-user.interface';
// import { Roles } from 'src/Auth/components/decorators/roles.decorator';
// import { Permissions } from 'src/Auth/components/decorators/permissions.decorator';
// import { CreateUserWithTemplateDto } from './dto/create-user-with-details.dto';
// import { Actions } from 'src/Auth/components/decorators/global.enums';
// import { Role } from 'src/Auth/components/decorators/global.enums';
// import { CreateUserRole } from 'src/Auth/components/decorators/global.enums';

// @Controller('api/manager')
// export class ITManController {
//     constructor( private managerService: ManagerService) {}

//     //<<<<------- THE CONTROL ROUTES INTENDED FOR IT MANAGER -------> 

//     @Post('user-create')
//     @Roles(CreateUserRole.ADMINISTRATOR)
//     //can enable allPermissions because its now centralized for Information Technology
//     @Permissions(Actions.CREATE)
//     @UsePipes(new ValidationPipe ({whitelist:true}))
//     async createUser(
//         @Body() createUserWithTemplateDto: CreateUserWithTemplateDto,
//         @Req() req: RequestWithUser,
//     ) {
//         const { user_details, user_permission_template_id, module_id } = createUserWithTemplateDto
//         return this.managerService.createUserEmployee( createUserWithTemplateDto, req);
//     }

//     @Post('new-token')
//     @Roles()    //to make enums
//     @Permissions('Approve ticket')      
//     @UsePipes(new ValidationPipe ({whitelist:true}))
//     async newResetToken(@Body() body: { email: string }) {
//         return this.managerService.userNewResetToken(body.email);
//     }
// }

// @Controller('api/hr-manager')
// export class HRManController {
//     constructor(private managerService: ManagerService) {}

//     //<<<<------- THE CONTROL ROUTES INTENDED FOR HR MANAGER ------->
//     // @Post('user-create')
//     // @Roles('Human Resources')
//     // // @Permissions('Add Employee')
//     // @UsePipes(new ValidationPipe ({whitelist:true}))
//     // async createUser(
//     //     @Body() createUserDto: CreateUserAccountDto,
//     //     @Req() req: RequestWithUser,
//     // ) {
//     //     const createdBy = req.user.id;
//     //     return this.managerService.createUserEmployee(createUserAccountDto,createUserWithTemplateDto, req);
//     // }

//     // @Post('new-token')
//     // @Roles('Human Resources')
//     // @Permissions('Add Employee')
// }

// @Controller('api/accounting-manager')
// export class ACCManController {
//     constructor(private managerService: ManagerService) {}


//     //<<<<------- THE CONTROL ROUTES INTENDED FOR ACCOUNTING MANAGER -------> 
// }

// @Controller('api/operations-manager')
// export class OPSManController {
    
//     //<<<<------- THE CONTROL ROUTES INTENDED FOR OPERATIONS MANAGER -------> 
// }

// @Controller('api/payroll-manager')
// export class PRMANController {

//     //<<<<------- THE CONTROL ROUTES INTENDED FOR PAYROLL MANAGER -------> 
// }

// @Controller('api/inventory-manager')
// export class INMANController {

//     //<<<<------- THE CONTROL ROUTES INTENDED FOR INVENTORY MANAGER -------> 
// }

// @Controller('api/purchasing-manager')
// export class PRCController {

//     //<<<<------- THE CONTROL ROUTES INTENDED FOR PURCHASING MANAGER -------> 
// }

// @Controller('api/finance-manager')
// export class FINManController {

//     //<<<<------- THE CONTROL ROUTES INTENDED FOR FINANCIAL MANAGER -------> 
// }

// @Controller('api/asst-manager')
// export class ASTManController {

//     //<<<<------- THE CONTROL ROUTES INTENDED FOR ASSET MANAGER -------> 
// }

// @Controller('api/compliance-manager')
// export class CPLManController {

//     //<<<<------- THE CONTROL ROUTES INTENDED FOR COMPLIANCE MANAGER -------> 
// }

// //eportal -> admin