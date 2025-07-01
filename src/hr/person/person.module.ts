import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { UserModule } from '../../manager/users/users.module';
// import { JwtCustomModule } from '../../auth/middleware/jwt.module';
import { PrismaService } from 'prisma/prisma.service';
import { PersonController } from './person.controller';
import { JwtStrategy } from 'src/auth/middleware/jwt.strategy';

@Module({
    imports: [UserModule],
    controllers: [PersonController],
    providers: [PersonService, PrismaService,  JwtStrategy],
    exports: [PersonModule],
})
export class PersonModule {}
