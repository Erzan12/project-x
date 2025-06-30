import { ConflictException, Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { CreatePersonDto } from '../hr/person/dto/create-person.dto';
import { ResetPasswordWithTokenDto } from './dto/reset-password-with-token-dto';

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
    // async login(loginDto: LoginDto) {
    //     const { username, password } = loginDto;

    //   const user = await this.prisma.user.findUnique({
    //     where: { username },
    //     include: {
    //         role: {
    //         include: {
    //             role_permissions: {
    //             include: { permission: true },
    //             },
    //         },
    //         },
    //         user_permissions: {
    //         include: { permission: true },
    //         },
    //     },
    //     });

    //     //User will force to update password first upon first login before can proceed
    //     if (!user) {
    //         throw new BadRequestException('Username was not registered.');
    //     }

    //     const isPasswordValid = await bcrypt.compare(password, user.password);

    //     console.log('Entered password:', password);
    //     console.log('Stored hashed password:', user.password);
    //     console.log('Password valid?', isPasswordValid);
        
    //     if (!isPasswordValid) {
    //         throw new BadRequestException('Invalid credentials');
    //     }

    //     //Check if user is required to reset password, query from the require_reset not username
    //     const { must_reset_password, require_reset } = user;

    //     // Handle mandatory password reset on first login
    //     const mustResetNow = must_reset_password;

    //     if (mustResetNow) {
    //         return {
    //             status: 'password_require_reset',
    //             message: 'It is require to reset your password for first time log in before you can proceed',
    //             userId: user.id,
    //         };
    //     }


    //     if (user.stat !== 1) {
    //         throw new BadRequestException('Your account was deactivated.');
    //     }

    //     // Cancel forgot password
    //     if (user.password_reset && user.password_reset !== '') {
    //         await this.prisma.user.update({
    //             where: { id: user.id },
    //             data: { password_reset: '' },
    //         });
    //     }

    //     // Check user token
    //     const passwordresetToken = await this.prisma.passwordResetToken.findFirst({
    //         where: { user_id: user.id },
    //         });

    //     if (!passwordresetToken) {
    //         throw new BadRequestException('No token added for this user!');
    //     }

    //     const key = passwordresetToken.token;
    //     const issuedAt = Math.floor(Date.now() / 1000);
    //     // const expirationTime = issuedAt + 60 * 60 * 24 * 30;

    //     const payload = {
    //         iat: issuedAt,
    //         // exp: expirationTime,
    //         sub: user.id,
    //         name: user.username,
    //         role: user.role.name,
    //         req: require_reset === 1 || password === 'avegabros',
    //     };

    //     const token = this.jwtService.sign(payload, {
    //         secret: key,
    //         expiresIn: '1h', //already added expiration here in payload
    //     });

    //     const isNewAccount = password === 'avegabros' || user.password_reset || user.require_reset === 1;

    //     return {
    //         status: 1,
    //         token,
    //         payload,
    //         message: 'Login Successfully',
    //         ...(isNewAccount && { new_account: 1 }),
    //     };

    // }

    //v3 log in with valideUser
    

    //For first time log in password reset
    // async passwordReset(userId: number, newPassword: string) {
    //     const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    //     const updatedUser = await this.prisma.user.update({
    //         where : { id: userId },
    //         data : {
    //             password: hashedNewPassword,
    //             must_reset_password: false,
    //         },
    //     });

    //For first time log in password reset with token from user or person registration/creation
    async resetPasswordWithToken(dto: ResetPasswordWithTokenDto, token: string) {
        const { newPassword } = dto;

        if (!token) {
            throw new BadRequestException('Reset token is required.');
        }

        // Step 1: Find the user token
        const passwordresetToken = await this.prisma.passwordResetToken.findFirst({
            where: { token: token },
            include: { user: true },
        });

        if (!passwordresetToken) {
            throw new BadRequestException('Invalid or expired reset token.');
        }

        // Optional: check expiration
        if (passwordresetToken.expires_at < new Date()) {
            throw new BadRequestException('Reset token has expired.');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Step 2: Update the user's password
        const updatedUser = await this.prisma.user.update({
            where: { id: passwordresetToken.user_id },
            data: {
                password: hashedPassword,       // your hashed new password
                require_reset: 0,               // disable require_reset flag
                must_reset_password: false,     // also disable must_reset_password
                password_reset: '',             // clear any reset token/flag
            },
        });

        // Step 3: (Optional) delete the token or mark it used

        //<---- this section will delete the generated reset token in db upon changing for your new password -->
        // await this.prisma.userToken.delete({ where: { id: userToken.id } });

        return {
            status: 'success',
            message: `Password has been reset. You may now log in!`,
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
            }
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

    //v3 log in with validateUser
    async validateUser(username: string, password: string) {
        const user = await this.prisma.user.findUnique({
        where: { username },
        include: {
            role: {
            include: {
                role_permissions: {
                include: { permission: true },
                },
            },
            },
            user_permissions: {
            include: { permission: true },
            },
        },
        });

        if (!user) throw new UnauthorizedException('User not found');

        const isPasswordValid = await bcrypt.compare(password, user.password);

        console.log('Entered password:', password);
        console.log('Stored hashed password:', user.password);
        console.log('Password valid?', isPasswordValid);
        if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

        return user;
    }

    async login(loginDto: LoginDto) {
        const { username, password } = loginDto;

        const user = await this.validateUser(username, password);

        if (user.must_reset_password) {
        return {
            status: 'password_require_reset',
            message: 'You must reset your password before proceeding',
            userId: user.id,
        };
        }

        if (user.stat !== 1) {
        throw new BadRequestException('Your account was deactivated.');
        }

        // Reset any pending password reset token
        if (user.password_reset && user.password_reset !== '') {
        await this.prisma.user.update({
            where: { id: user.id },
            data: { password_reset: '' },
        });
        }

        const resetToken = await this.prisma.passwordResetToken.findFirst({
        where: { user_id: user.id },
        });

        if (!resetToken) {
        throw new BadRequestException('No token assigned to this user.');
        }

        const allPermissions = [
        ...user.role.role_permissions.map(rp => rp.permission.name),
        ...user.user_permissions.map(up => up.permission.name),
        ];

        const issuedAt = Math.floor(Date.now() / 1000);
        const payload = {
        sub: user.id,
        name: user.username,
        role: user.role.name,
        permissions: allPermissions,
        iat: issuedAt,
        };

        const token = this.jwtService.sign(payload, {
        secret: resetToken.token,
        expiresIn: '1h',
        });

        const isNewAccount = password === 'avegabros' || user.password_reset || user.require_reset === 1;

        return {
        status: 1,
        message: 'Login successful',
        token,
        payload,
        ...(isNewAccount && { new_account: 1 }),
        };
    }
}
