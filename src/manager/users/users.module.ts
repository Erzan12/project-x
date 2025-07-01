import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthController } from '../users/users.controller';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuthService } from '../../auth/auth.service';
import { AuthModule } from '../../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../../mail/mail.service';
import { ProtectedController } from './sample.controller';


@Module({
  imports: [ AuthModule],
  controllers: [AuthController, ProtectedController],
  providers: [UsersService, PrismaService, AuthService, JwtService, MailService],
  exports: [AuthService, UsersService],
})
export class UserModule {}
