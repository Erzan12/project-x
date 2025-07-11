// import { Module } from '@nestjs/common';
// import { ManagerService } from './manager.service';
// import { JwtService } from '@nestjs/jwt';
// import { HomeController, ProfileController } from 'src/Global/global.controller';
// import { PrismaService } from 'prisma/prisma.service';
// import { AuthService } from 'src/Auth/auth.service';
// import { AuthModule } from 'src/Auth/auth.module';
// import { MailService } from 'src/Mail/mail.service';
// import { HRManController, ITManController } from './manager.controller';
// import { ProtectedController } from './protected.controller';

// @Module({
//   imports: [ AuthModule ],
//   controllers: [ ProtectedController, HomeController, ProfileController,  ITManController, HRManController ],
//   providers: [ManagerService, PrismaService, AuthService, JwtService, MailService],
//   exports: [AuthService, ManagerService],
// })
// export class ManagerModule {}
