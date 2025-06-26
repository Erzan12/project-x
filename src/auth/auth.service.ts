import { ConflictException, Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { CreatePersonDto } from '../users/dto/create-person.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    
    // V1 LOGIN WITHOUT RESET PASSWORD AND ACCOUNT DEACTIVATION
    // async login({ username, password }: LoginDto) {
    //     const user = await this.prisma.user.findUnique({
    //         where: { username },
    //         include: {
    //             role: {
    //                 include: {
    //                     role_permissions: { include: { permission: true } },
    //                 },
    //             },
    //             user_permissions: { include: { permission: true } },
    //         },
    //     });

    //     if (!user || !user.is_active) {
    //         throw new UnauthorizedException('Invalid user or inactive account');
    //     }

    //     const isPasswordMatch = await bcrypt.compare(password, user.password);
    //     if (!isPasswordMatch) {
    //         throw new UnauthorizedException('Invalid credentials');
    //     }

    //     const payload = { sub: user.id, username: user.username };
    //     const token = await this.jwtSerivce.signAsync(payload, {
    //         secret: process.env.JWT_SECRET || 'supersecretkey',
    //         expiresIn: '1h',
    //     });

    //     //save token in DB (tokens table)
    //     await this.prisma.token.create({
    //         data: {
    //             user_id: user.id,
    //             token: token,
    //             expires_at: new Date(Date.now() + 60 * 60 * 1000), // 1hour later
    //             device_info: {
    //                 device_type: 'web',
    //                 browser: 'chrome', // optional: pull from user-agent header later
    //                 ip_address: '127.0.0.1',
    //             },
    //         },
    //     });

    //     return {
    //         access_token: token,
    //         user: {
    //             id: user.id,
    //             username: user.username,
    //             role: user.role?.name,
    //         },
    //     };
    // }

    // V2 LOGIN WITH PASSWORD RESET AND ACCOUNT DEACTIVATION 30 DAYS AFTER
    async login(loginDto: LoginDto) {
        const { username, password } = loginDto;

        const user = await this.prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            throw new BadRequestException('Username was not registered.');
        }

        // Compare hashed password
        // const ispasswordValid = await bcrypt.compare(password, user.password);

        // if (!ispasswordValid) {
        //     throw new BadRequestException('Invalid password.');
        // }

        console.log('Entered password:', password);
        console.log('Stored hashed password:', user.password);
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        console.log('Password valid?', isPasswordValid);
        
        if (!isPasswordValid) {
            throw new BadRequestException('Invalid credentials');
        }

        if (user.stat !== 1) {
            throw new BadRequestException('Your account was deactivated.');
        }

        // Cancel forgot password
        if (user.password_reset && user.password_reset !== '') {
            await this.prisma.user.update({
                where: { id: user.id },
                data: { password_reset: '' },
            });
        }

        // const isPasswordValid = await bcrypt.compare(password, user.password);
        // if (!isPasswordValid) {
        //     throw new UnauthorizedException('Invalid credentials');
        // }

        // Check user token
        const userToken = await this.prisma.userToken.findFirst({
            where: { user_id: user.id },
            });

        if (!userToken) {
            throw new BadRequestException('No token added for this user!');
        }

        const key = userToken.token_key;
        const issuedAt = Math.floor(Date.now() / 1000);
        // const expirationTime = issuedAt + 60 * 60 * 24 * 30;

        const payload = {
            iat: issuedAt,
            // exp: expirationTime,
            sub: user.id,
            name: user.username,
            req: user.require_reset === 1 || password === 'avegabros',
        };

        const token = this.jwtService.sign(payload, {
            secret: key,
            expiresIn: '1h', //already added expiration here in payload
        });

        const isNewAccount = password === 'avegabros' || user.password_reset || user.require_reset === 1;

        return {
            status: 1,
            token,
            payload,
            message: 'Login Successfully',
            ...(isNewAccount && { new_account: 1 }),
        };

    }

    // TRANSFERRED TO USER DIRECTORY
    // async register(dto: CreatDto) {
    //     const existing = await this.prisma.user.findFirst({
    //         where: {
    //             OR: [
    //                 { username: dto.username },
    //                 { email: dto.email },
    //             ],
    //         },
    //     });

    //     if (existing) {
    //         throw new ConflictException('Username or email already taken');
    //     }

    //     // create person
    //     const person = await this.prisma.person.create({
    //         data: {
    //             first_name: dto.first_name,
    //             middle_name: dto.middle_name,
    //             last_name: dto.last_name,
    //             date_of_birth: new Date(dto.date_of_birth), //added required can be optional later
    //         },
    //     });

    //       // 2. Create user
    //     const role = await this.prisma.role.findUnique({
    //         where: { id: dto.role_id },
    //         });

    //         if (!role) {
    //         throw new Error('Invalid role_id');
    //         }

    //     console.log('DTO Role ID:', dto.role_id);

    //     const hashedPassword = await bcrypt.hash(dto.password, 10);

    //     const user = await this.prisma.user.create({
    //         data: {
    //         username: dto.username,
    //         email: dto.email,
    //         password: hashedPassword,
    //         person_id: person.id,
    //         role_id: dto.role_id,
    //         },
    //     });

    //     return {
    //         message: 'User registered successfully',
    //         user: {
    //         id: user.id,
    //         username: user.username,
    //         email: user.email,
    //         },
    //     };
    // }
}
