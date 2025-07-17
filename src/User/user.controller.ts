import { Controller, Body, Post, Get, Patch } from '@nestjs/common';
import { CreateUserWithTemplateDto } from './dto/create-user-with-template.dto';
import { SessionUser } from 'src/Auth/components/decorators/session-user.decorator';
import { UserService } from './user.service';
import { Can } from 'src/Auth/components/decorators/can.decorator';
import { ACTION_CREATE, ACTION_READ, ACTION_UPDATE, MODULE_ADMIN, MODULE_MNGR } from 'src/Auth/components/decorators/ability';
import { SM_ADMIN } from 'src/Auth/components/constants/core-constants';
import { RequestUser } from 'src/Auth/components/types/request-user.interface';
import { DeactivateUserAccountDto, ReactivateUserAccountDto } from './dto/user-account-status.dto';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

        //view user accounts 
        //to set up viewuser accounts in service
        @Get()
        @Can({
            action: ACTION_READ,
            subject: SM_ADMIN.USER_ACCOUNT,
            module: [ MODULE_MNGR, MODULE_ADMIN ] // or MODULE_HR if it's from Admin
        })
        async viewUserAccounts(
            @Body() createUserWithTemplateDto: CreateUserWithTemplateDto,
            @SessionUser() user: RequestUser
        ) {
        return this.userService.createUserEmployee(createUserWithTemplateDto, user);
        }

        //create user account
        @Post()
        @Can({
            action: ACTION_CREATE,
            subject: SM_ADMIN.USER_ACCOUNT,
            module: [ MODULE_MNGR, MODULE_ADMIN] // or MODULE_HR if it's from Admin
        })
        async createUser(
            @Body() createUserWithTemplateDto: CreateUserWithTemplateDto,
            @SessionUser() user: RequestUser
        ) {
        return this.userService.createUserEmployee(createUserWithTemplateDto, user);
        }

        //for expired first time login reset token key 
        @Post('new_reset_token')
        @Can({
            action: ACTION_CREATE,
            subject: SM_ADMIN.USER_ACCOUNT,
            module: [MODULE_MNGR, MODULE_ADMIN] // or MODULE_HR if it's from Admin
        })     
        async newResetToken(
            @Body() body: { email: string },
            @SessionUser() user: RequestUser,
        ) {
            return this.userService.userNewResetToken(body.email, user);
        }

        // view user tokens
        // to set up viewuser accounts in service
        @Get('token_keys')
        @Can({
            action: ACTION_READ,
            subject: SM_ADMIN.USER_TOKEN_KEY,
            module: [MODULE_ADMIN]
        })
         async viewUserKeys(
            @Body() createUserWithTemplateDto: CreateUserWithTemplateDto,
            @SessionUser() user: RequestUser
        ) {
        return this.userService.createUserEmployee(createUserWithTemplateDto, user);
        }

        @Patch('deactivate')
        @Can({
            action: ACTION_UPDATE,
            subject: SM_ADMIN.USER_ACCOUNT,
            module: [MODULE_ADMIN],
        })
        async deactivateUser(
            @Body() deactivateUserAccountDto: DeactivateUserAccountDto,
            @SessionUser() user: RequestUser,
        ) {
        return this.userService.deactivateUserAccount(deactivateUserAccountDto,user);
        }

        @Patch('reactivate')
        @Can({
            action: ACTION_UPDATE,
            subject: SM_ADMIN.USER_ACCOUNT,
            module: [MODULE_ADMIN],
        })
        async reactivateUser(
            @Body() reactivateUserAccountDto: ReactivateUserAccountDto,
            @SessionUser() user: RequestUser,
        ) {
            return this.userService.reactivateUserAccount(reactivateUserAccountDto,user)
        }
}

