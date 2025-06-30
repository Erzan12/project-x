import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class UsersService {
    constructor (private readonly prisma: PrismaService, private readonly mailService: MailService, ) {}

   async createUser(createUserDto: CreateUserDto, createdBy: number) {
    const plainPassword = createUserDto.password;
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // Step 0: Validate and check user if it exist via username and email
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

        // transferred to employee service
        // const person = await this.prisma.person.create({
        //     data: {
        //     first_name: createPersonDto.first_name,
        //     last_name: createPersonDto.last_name,
        //     middle_name: createPersonDto.middle_name,
        //     date_of_birth: new Date(createPersonDto.date_of_birth),
        //     // optionally add gender, nationality, etc. if available in DTO
        //     },
        // });

        // Step 2: Create the User using the person_id
        const user = await this.prisma.user.create({
            data: {
                employee_id: createUserDto.employee_id,
                username: createUserDto.username,
                email: createUserDto.email,
                role_id: createUserDto.role_id,
                password: hashedPassword,
                stat: 1,
                require_reset: 1,
                created_by: createdBy,
                created_at: new Date(),
            }, 
            // include: {
            //     employee: true        // 👈 this tells prisma to include related field employee_id in user model or table
            // },
            // },
            //   include: {
            //     userTokens: true, // 👈 This tells Prisma to include related tokens
            // },
        });

        // Step 3: Create a user token
        const tokenKey = crypto.randomBytes(64).toString('hex');

        const createdToken = await this.prisma.passwordResetToken.create({
            data: {
            user_id: user.id,
            token: tokenKey,
            expires_at: new Date(Date.now() + 60 * 60 * 24 * 30), // 1 hour
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
            created_by: createdBy,
            userId: user.id,
            password: plainPassword,
            resetToken: createdToken.token, // send this in email or secure output only
        };
    }
}

