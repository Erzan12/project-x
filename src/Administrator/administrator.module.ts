import { Module } from '@nestjs/common';
import { AuthModule } from 'src/Auth/auth.module';
import { AdministratorController } from 'src/Administrator/administrator.controller';
import { AdministratorService } from 'src/Administrator/administrator.service';
import { JwtStrategy } from 'src/Auth/middleware/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';

@Module({
    imports:[AuthModule],
    controllers: [AdministratorController],
    providers: [AdministratorService, JwtStrategy, JwtService, PrismaService],
    exports: [AdministratorModule]

})
export class AdministratorModule {}
