import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'prisma/prisma.service';
import { JwtStrategy } from 'src/Auth/middleware/jwt.strategy';

@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService, PrismaService, JwtStrategy],
    exports:[UserModule],
})
export class UserModule {
}
