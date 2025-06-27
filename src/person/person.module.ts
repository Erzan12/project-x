import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { UserModule } from 'src/users/users.module';
import { JwtCustomModule } from 'src/middleware/jwt.module';
import { PrismaService } from 'prisma/prisma.service';
import { PersonController } from './person.controller';

@Module({
    imports: [UserModule, JwtCustomModule],
    controllers: [PersonController],
    providers: [PersonService, PrismaService],
    exports: [PersonModule],
})
export class PersonModule {}
