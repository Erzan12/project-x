import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { CreatePersonDto } from './dto/create-person.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor (private readonly prisma: PrismaService) {}

   async createUser(createUserDto: CreatePersonDto, createdBy: number) {
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

    // Step 1: Create the Person
    const person = await this.prisma.person.create({
        data: {
        first_name: createUserDto.first_name,
        last_name: createUserDto.last_name,
        middle_name: createUserDto.middle_name,
        date_of_birth: new Date(createUserDto.date_of_birth),
        // optionally add gender, nationality, etc. if available in DTO
        },
    });

    // Step 2: Create the User using the person_id
    const user = await this.prisma.user.create({
        data: {
        username: createUserDto.username,
        email: createUserDto.email,
        role_id: createUserDto.role_id,
        password: hashedPassword,
        person_id: person.id,            // required relation
        stat: 1,
        require_reset: 1,
        created_by: createdBy,
        created_at: new Date(),
        },
    });

    // Step 3: Create a user token
    const tokenKey = crypto.randomBytes(64).toString('hex');

    await this.prisma.userToken.create({
        data: {
        user_id: user.id,
        token_key: tokenKey,
        expires_at: new Date(Date.now() + 60 * 60 * 24 * 30), // 1 hour
        },
    });

    // Step 4: (optional) send email, insert history, etc.

    console.log('Plain password before hashing:', plainPassword);
    console.log('Hashed password stored:', hashedPassword);

    return {
        status: 'success',
        message: `User ${user.username} created with temporary password.`,
        created_by: createdBy,
        userId: user.id,
        password: plainPassword, // send this in email or secure output only
    };
    }


}

