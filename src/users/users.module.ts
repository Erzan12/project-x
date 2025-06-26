import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthController } from '../users/users.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtCustomModule } from '../middleware/jwt.module';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [ JwtCustomModule, AuthModule],
  controllers: [AuthController],
  providers: [UsersService, PrismaService, AuthService, JwtService, MailService],
  exports: [AuthService, UsersService],
})
export class UserModule {}
