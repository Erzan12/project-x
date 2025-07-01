import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from '../manager/users/users.service';
import { JwtStrategy } from './middleware/jwt.strategy';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports:[],
  controllers: [AuthController],
  providers: [AuthService, PrismaService,JwtStrategy, JwtService, UsersService, MailService, ConfigService],
  exports: [ AuthModule, JwtStrategy ],
})
export class AuthModule {}
