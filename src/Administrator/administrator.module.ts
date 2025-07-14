import { Module } from '@nestjs/common';
import { AuthModule } from 'src/Auth/auth.module';
import { AdministratorController } from 'src/Administrator/administrator.controller';
import { AdministratorService } from 'src/Administrator/administrator.service';
import { JwtStrategy } from 'src/Auth/middleware/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/User/user.service';
import { MailService } from 'src/Mail/mail.service';

@Module({
    imports:[AuthModule],
    controllers: [AdministratorController],
    providers: [AdministratorService, JwtStrategy, JwtService, PrismaService, UserService, MailService],
    exports: [AdministratorModule]

})
export class AdministratorModule {}
