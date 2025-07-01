import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersService } from '../src/manager/users/users.service';
import { UserModule } from '../src/manager/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
// import { JwtCustomModule } from '../src/auth/middleware/jwt.module';
// import { JwtMiddleware } from '../src/auth/middleware/jwt.middleware';
import { PrismaService } from 'prisma/prisma.service';
import { MailService } from './mail/mail.service';
import { ConfigModule } from '@nestjs/config';
import { PersonService } from './hr/person/person.service';
import { PersonController } from './hr/person/person.controller';
import { PersonModule } from './hr/person/person.module';
import { EmployeeService } from './hr/employee/employee.service';
import { EmployeeController } from './hr/employee/employee.controller';
import { EmployeeModule } from './hr/employee/employee.module';
import { JwtStrategy } from './auth/middleware/jwt.strategy';
import { AuthGuard } from '@nestjs/passport';
// import { RolesGuard } from './auth/common/guards/roles-permission.guard';
// import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    // Adding config here so dotenv will be global no more import per service with @nestjs/config
    ConfigModule.forRoot({
      isGlobal: true, // makes config available app-wide
      envFilePath: '.env', // optional: default is .env
    }),
    AuthModule,
    JwtModule, 
    UserModule, 
    PersonModule,
    EmployeeModule
  ],
  providers: [ 
    UsersService,
    PrismaService, 
    MailService, 
    PersonService, 
    EmployeeService,  
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
  controllers: [PersonController, EmployeeController],
})
export class AppModule {}

// implements NestModule{
//   configure(consumer: MiddlewareConsumer) {
//       // consumer.apply(JwtMiddleware).forRoutes('*') // Apply to all routes for now

//       // consumer
//       //   .apply(JwtMiddleware)
//       //   .exclude('auth/login') // skip routes
//       //   .forRoutes('*');

//       //alternative approach for excluding a public route
//       consumer
//       .apply(JwtStrategy)
//       .exclude(
//         { path: 'auth/login', method: RequestMethod.POST },
//         { path: 'auth/reset-password', method: RequestMethod.POST},
//         { path: 'person/:id', method: RequestMethod.DELETE},
//         { path: 'admin/user-register', method: RequestMethod.POST },
//         { path: 'hr/employee-create', method: RequestMethod.POST},
//         // Add more exclusions here if needed
//       )
//       .forRoutes('*');
//   }
// }
