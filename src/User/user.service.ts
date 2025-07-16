import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'prisma/prisma.service';
import { MailService } from 'src/Mail/mail.service';
import { CreatePermissionTemplateDto } from 'src/Administrator/role/dto/create-permission-template.dto';
import { CreateUserWithTemplateDto } from './dto/create-user-with-template.dto';

@Injectable()
export class UserService {
    constructor (private readonly prisma: PrismaService, private readonly mailService: MailService, ) {}
    
    async createUserEmployee(createUserWithTemplateDto: CreateUserWithTemplateDto, user) {

        // console.log('Raw body:', req.body);
        // console.log('DTO after transform:', createUserWithTemplateDto);

        return this.prisma.$transaction(async (tx) => {
            // Use tx.user.create(), tx.userRole.create(), etc. inside here

        const plainPassword = createUserWithTemplateDto.user_details.password;
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // validate and check user if it exist via username and email
        const existingUser = await this.prisma.user.findFirst({
            where : {
                OR: [
                    { username: createUserWithTemplateDto.user_details.username },
                    { email: createUserWithTemplateDto.user_details.email },
                ],
            },
        });

        if (existingUser) {
            throw new BadRequestException('Username or email address already exist!');
        }

        const createUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: {
                employee: {
                    include: {
                        person: true, //to map user creator name
                        position: true,
                    },
                },
            },
        });
        if (!createUser || !createUser.employee || !createUser.employee.person) {
            throw new BadRequestException(`Creator (manager) information not found.`);
        }

        const admin = `${createUser.employee.person.first_name} ${createUser.employee.person.last_name}`;
        const adminPos = createUser.employee.position.name;

        //this will ensure the employee_id with INT will be called not the string
        //validate if employee exist or registered
        const employee = await this.prisma.employee.findUnique({
            where: { employee_id : createUserWithTemplateDto.user_details.employee_id }, // string like "ABISC-IT-123"
            include: { person: true } // include person relation so that person will reflect or link to the user created
        });

        if (!employee) {
            throw new BadRequestException('Employee not found');
        }

        //validate if user already exist
        const userExist = await this.prisma.user.findUnique({
            where : { employee_id : employee.id }
        })

        if (userExist) {
            throw new BadRequestException('User already exist');
        } 

        // Create user
        const userCreate = await tx.user.create({
            data: {
                employee_id: employee.id,
                person_id: employee.person.id,
                username: createUserWithTemplateDto.user_details.username,
                email: createUserWithTemplateDto.user_details.email,
                password: hashedPassword,
                stat: 1,
                require_reset: 1,
                created_by: createUser.id,
                created_at: new Date(),
                role_id: createUserWithTemplateDto.role_id,
                module_id: createUserWithTemplateDto.module_id,
            },
            include: {
                employee:true,
            }
        });

        //Create UserRole (user linked to role)
        const userRole = await tx.userRole.create({
            data: {
                user_id: userCreate.id,
                role_id: createUserWithTemplateDto.role_id,
                module_id: createUserWithTemplateDto.module_id,
                created_at: new Date(),
            },
        });

        // Create UserPermission based on created PermissionTemplate
        const permissionTemplateId = createUserWithTemplateDto.user_permission_template_id;

        //fetch role permissions from the template
        const templatePermissions = await this.prisma.permissionTemplateRolePermission.findMany({
            where: { permission_template_id: permissionTemplateId },
            include: { role_permission: true },
        });

        // insert user permissions based on template
        await tx.userPermission.createMany({
            data: templatePermissions.map((tp) => ({
                user_id: userCreate.id,
                user_role_id: userRole.id, //still needed
                user_role_permission: tp.role_permission.action, // the actual permission action
                role_permission_id: tp.role_permission_id, // linking to the role permission
            })),
        });

        // record the permission template that was used when creating user
        await tx.user.update({
            where: { id: userCreate.id },
            data: {
                    // if going to apply.. add the permission_template_id on the user model field
                permission_template_id: permissionTemplateId, // add this field to User model if needed
            },
        });

        // Step 4: Create a password reset token
        const tokenKey = crypto.randomBytes(64).toString('hex');

        const createdToken = await tx.passwordResetToken.create({
            data: {
                user_id: userCreate.id,
                token: tokenKey,
                // ⛔ TEMP: For testing - token expires in 3 days
                expires_at: new Date(Date.now() + 60 * 60 * 24 * 3 * 1000), // 3 day expire -> 60 * 60 = 1hour * 24 = 1 day *3 = 3days
            },
        });

        // send email, insert history, etc.

        console.log('Plain password before hashing:', plainPassword);
        console.log('Hashed password stored:', hashedPassword);

        // After creating user and userToken:
        await this.mailService.sendWelcomeMail(
            user.email,
            user.username,
            plainPassword,
            tokenKey,
        );

        return {
            status: 'success',
            message: `User ${userCreate.username} with Employee ID ${userCreate.employee.employee_id} created with temporary password.`,
            created_by: {
                id: createUser.id,
                name: admin,
                position: adminPos,
            },
            user_id: user.id,
            password: plainPassword,
            reset_token: createdToken.token, // send this in email or secure output only
        };
        });
    }

    async userNewResetToken(email: string,user) {
        //find user via email
        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id }
        });

        if(!requestUser) {
            throw new BadRequestException('User with this email not found')
        }
        
        //optionally deletes the expired token in db
        await this.prisma.passwordResetToken.deleteMany({
            where: { id: requestUser.id }
        })

        //generate new token
        const tokenKey = crypto.randomBytes(64).toString('hex');

        const createdToken = await this.prisma.passwordResetToken.create({
            data: {
                user_id: user.id,
                token: tokenKey,
                // ⛔ TEMP: For testing - token expires in 3 days
                expires_at: new Date(Date.now() + 60 * 60 * 24 * 3 * 1000), //3days
            }
        });

        //send new reset email
        await this.mailService.sendResetTokenEmail(
            user.email,
            user.username,
            tokenKey,
        );

        return ({
            status: 'success',
            message: `Reset token created and sent to ${requestUser.email}`,
            user_id: requestUser.id,
            reset_token: createdToken.token,
        });
    }
}
