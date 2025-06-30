import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from '../manager/users/users.service';
import { JwtStrategy } from './middleware/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecretkey',
      signOptions: { expiresIn: '1h' },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService,JwtStrategy, UsersService, MailService],
  exports: [ AuthModule ],
})
export class AuthModule {}
