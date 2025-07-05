import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { MailService } from '../Mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './middleware/jwt.strategy';
import { AuthService } from './auth.service';
import { ManagerService } from 'src/Manager/manager.service';

@Module({
  imports:[],
  controllers: [AuthController],
  providers: [AuthService, PrismaService,JwtStrategy, JwtService, ManagerService, MailService, ConfigService],
  exports: [ AuthModule, JwtStrategy ],
})
export class AuthModule {}
