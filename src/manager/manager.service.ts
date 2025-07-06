import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
// import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { MailService } from 'src/Mail/mail.service';
import { CreateUserAccountDto } from './dto/create-user.dto';

@Injectable()
export class ManagerService {
    constructor (private readonly prisma: PrismaService, private readonly mailService: MailService, ) {}

   async createUserEmployee(createUserDto: CreateUserAccountDto, created_by: number) {
    const plainPassword = createUserDto.password;
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // validate and check user if it exist via username and email
        const existingUser = await this.prisma.user.findFirst({
            where : {
                OR: [
                    { username: createUserDto.username },
                    { email: createUserDto.email },
                ],
            },
        });

        if (existingUser) {
            throw new BadRequestException('Username or email address already exist!');
        }

        const creator = await this.prisma.user.findUnique({
            where: { id: created_by },
            include: {
                employee: {
                    include: {
                        person: true, //to map user creator name
                    },
                },
            },
        });
        if (!creator || !creator.employee || !creator.employee.person) {
            throw new BadRequestException(`Creator (manager) information not found.`);
        }

        const managerName = `${creator.employee.person.first_name} ${creator.employee.person.last_name}`;
        const managerPosition = creator.employee.position;

        //this will ensure the employee_id with INT will be called not the string
        //validate if employee exist or registered
        const employee = await this.prisma.employee.findUnique({
            where: { employee_id : createUserDto.employee_id }, // string like "ABISC-IT-123"
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

        // Step 2: Create the User using the person_id
        const user = await this.prisma.user.create({
            data: {
                employee_id: employee.id, // This must be the Employee's `id`, not employee_id string, id (numeric PK) is internal and never exposed to frontend or users.
                person_id: employee.person.id, // this will link the created user to the person and employee connected to this user
                username: createUserDto.username,
                email: createUserDto.email,
                role_id: createUserDto.role_id,
                password: hashedPassword,
                stat: 1,
                require_reset: 1,
                created_by: created_by,
                created_at: new Date(),
            },
        });

        // Step 3: Create a user token
        const tokenKey = crypto.randomBytes(64).toString('hex');

        const createdToken = await this.prisma.passwordResetToken.create({
            data: {
            user_id: user.id,
            token: tokenKey,
            // ⛔ TEMP: For testing - token expires in 3 days
            expires_at: new Date(Date.now() + 60 * 60 * 24 * 3 * 1000), // 3 day expire -> 60 * 60 = 1hour * 24 = 1 day *3 = 3days
            },
        });

        // Step 4: (optional) send email, insert history, etc.

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
            message: `User ${user.username} created with temporary password.`,
            created_by: {
                id: creator.id,
                name: managerName,
                position: managerPosition,
            },
            user_id: user.id,
            password: plainPassword,
            reset_token: createdToken.token, // send this in email or secure output only
        };
    }

    async userNewResetToken(email: string) {
        //find user via email
        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        if(!user) {
            throw new BadRequestException('User with this email not found')
        }
        
        //optionally deletes the expired token in db
        await this.prisma.passwordResetToken.deleteMany({
            where: { user_id: user.id }
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
            message: `Reset token created and sent to ${user.email}`,
            userId: user.id,
            resetToken: createdToken.token,
        });
    }
}

