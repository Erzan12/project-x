import { ConflictException, Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { ResetPasswordWithTokenDto } from './dto/reset-password-with-token-dto';
import { v4 as uuidv4 } from 'uuid';

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

        //validate if the password is the same as the old password
        const user = passwordresetToken.user;
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            throw new BadRequestException('New password cannot be the same as the old password, Please add a new one!')
        }
        
        //hashed the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Step 2: Update the user's password
        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
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
                //map for role permission prisma
                role_permissions: {
                    include: { permission: true },
                },
            },
            },
            //map for user_permission prisma
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

        //removed roles and permissions in jwt log in payload for more minimal and simplier jwt token
        // to include role and permission of the user in the payload
        // const allPermissions = [
        //     ...user.role.role_permissions.map(rp => rp.permission.action),
        //     ...user.user_permissions.map(up => up.permission.action),
        // ];
        //             role: user.role.name,
        //     permissions: allPermissions,

        const issuedAt = Math.floor(Date.now() / 1000);

        const payload = {
            sub: user.id,
            name: user.username,
            iat: issuedAt,
        };

        //JWT service token is JWT Secret Key in .env with Payload from user name role id and permissions, the logic handling is in jwt.strategy.ts
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

    // <---- USING REFRESH TOKENS WHEN VALIDATING AND LOGING IN USERS STORING TOKENS TO REFRESH TOKEN MODEL USING JWT PAYLOAD UNDER THE HOOD -->
//     async validateUser(username: string, password: string) {
//     const user = await this.prisma.user.findUnique({
//       where: { username },
//       include: {
//         role: {
//           include: {
//             role_permissions: {
//               include: { permission: true },
//             },
//           },
//         },
//         user_permissions: {
//           include: { permission: true },
//         },
//       },
//     });

//     if (!user) throw new UnauthorizedException('User not found');

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

//     return user;
//   }

//     generateAccessToken(user: any): string {
//     const allPermissions = [
//       ...user.role.role_permissions.map(rp => rp.permission.name),
//       ...user.user_permissions.map(up => up.permission.name),
//     ];

//     const payload = {
//       sub: user.id,
//       name: user.username,
//       role: user.role.name,
//       permissions: allPermissions,
//     };

//     return this.jwtService.sign(payload, {
//       secret: process.env.JWT_SECRET,
//       expiresIn: '5m',
//     });
//     }

//     generateRefreshToken(): string {
//         return uuidv4(); // Secure, random refresh token via uuid v4
//     }

//     async login(loginDto: LoginDto) {
//         const { username, password } = loginDto;

//         const user = await this.validateUser(username, password);

//         if (user.must_reset_password) {
//         return {
//             status: 'password_require_reset',
//             message: 'You must reset your password before proceeding',
//             userId: user.id,
//         };
//         }

//         if (user.stat !== 1) {
//         throw new BadRequestException('Your account was deactivated.');
//         }

//         if (user.password_reset && user.password_reset !== '') {
//         await this.prisma.user.update({
//             where: { id: user.id },
//             data: { password_reset: '' },
//         });
//         }

//         const resetToken = await this.prisma.passwordResetToken.findFirst({
//         where: { user_id: user.id },
//         });

//         if (!resetToken) {
//         throw new BadRequestException('No token assigned to this user.');
//         }

//         // Generate tokens
//         const accessToken = this.generateAccessToken(user);
//         const refreshToken = this.generateRefreshToken();

//         // Store refresh token
//         await this.prisma.refreshToken.create({
//         data: {
//             user_id: user.id,
//             token: refreshToken,
//             expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
//             last_active_at: new Date(),
//         },
//         });

//         const isNewAccount =
//         password === 'avegabros' ||
//         user.password_reset ||
//         user.require_reset === 1;

//         return {
//         status: 1,
//         message: 'Login successful',
//         token: accessToken,
//         refresh_token: refreshToken, // Can be moved to secure cookie if needed
//         payload: {
//             id: user.id,
//             username: user.username,
//             role: user.role.name,
//         },
//         ...(isNewAccount && { new_account: 1 }),
//         };
//     }

//     // auth.service.ts
//     async refreshTokens(refreshToken: string) {
//     // Find the stored refresh token
//     const storedToken = await this.prisma.refreshToken.findUnique({
//         where: { token: refreshToken },
//         include: { user: {
//         include: {
//             role: { include: { role_permissions: { include: { permission: true } } } },
//             user_permissions: { include: { permission: true } },
//         }
//         } }
//     });

//     if (!storedToken || storedToken.revoked) {
//         throw new UnauthorizedException('Invalid or revoked refresh token');
//     }

//     // Check expiration
//     if (storedToken.expires_at < new Date()) {
//         throw new UnauthorizedException('Refresh token expired');
//     }

//     // Optional: Check inactivity timeout here (like you do in your middleware)
//     const now = new Date();
//     const lastActive = storedToken.last_active_at ?? storedToken.created_at;
//     const diffMinutes = (now.getTime() - new Date(lastActive).getTime()) / 1000 / 60;
//     const INACTIVITY_TIMEOUT_MINUTES = 60 * 24 * 7; // 7 days or your choice

//     if (diffMinutes > INACTIVITY_TIMEOUT_MINUTES) {
//         // revoke token
//         await this.prisma.refreshToken.update({
//         where: { token: refreshToken },
//         data: { revoked: true },
//         });
//         throw new UnauthorizedException('Session expired due to inactivity');
//     }

//     // Update last active timestamp
//     await this.prisma.refreshToken.update({
//         where: { token: refreshToken },
//         data: { last_active_at: now },
//     });

//     const user = storedToken.user;

//     // Generate new access token
//     const accessToken = this.generateAccessToken(user);

//     // Optionally generate new refresh token (refresh token rotation)
//     // For simplicity, reuse current refresh token (or implement rotation)
//     // const newRefreshToken = this.generateRefreshToken();
//     // await this.prisma.refreshToken.update({ where: { token: refreshToken }, data: { token: newRefreshToken, last_active_at: now } });

//     return {
//         accessToken,
//         refreshToken, // or newRefreshToken if rotating
//     };
//     }

}
