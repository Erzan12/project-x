import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
// import { JwtCustomModule } from '../../auth/middleware/jwt.module';
import { PrismaService } from 'prisma/prisma.service';
import { PersonController } from './person.controller';
import { JwtStrategy } from 'src/Auth/middleware/jwt.strategy';
import { ManagerModule } from 'src/Manager/manager.module';

@Module({
    imports: [ManagerModule],
    controllers: [PersonController],
    providers: [PersonService, PrismaService,  JwtStrategy],
    exports: [PersonModule],
})
export class PersonModule {}
