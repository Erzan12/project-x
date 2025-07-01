import { ConflictException, Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from 'prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { CreatePersonDto } from '../hr/person/dto/create-person.dto';
import { ResetPasswordWithTokenDto } from './dto/reset-password-with-token-dto';
import { JwtStrategy } from './middleware/jwt.strategy';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

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
        secret: process.env.JWT_SECRET,
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
