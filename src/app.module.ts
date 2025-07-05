import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { AuthModule } from './Auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
// import { JwtCustomModule } from '../src/auth/middleware/jwt.module';
// import { JwtMiddleware } from '../src/auth/middleware/jwt.middleware';
import { PrismaService } from 'prisma/prisma.service';
import { MailService } from './Mail/mail.service';
import { ConfigModule } from '@nestjs/config';
import { PersonService } from './HR/Person/person.service';
import { PersonController } from './HR/Person/person.controller';
import { PersonModule } from './HR/Person/person.module';
import { EmployeeService } from './HR/Employee/employee.service';
import { EmployeeController } from './HR/Employee/employee.controller';
import { EmployeeModule } from './HR/Employee/employee.module';
import { JwtStrategy } from './Auth/middleware/jwt.strategy';
import { AuthGuard } from '@nestjs/passport';
// import { RefreshTokenMiddleware } from './auth/middleware/refresh-token.middleware';
import { ManagerService } from './Manager/manager.service';
import { ManagerModule } from './Manager/manager.module';
import { UserService } from './User/user.service';
import { ManagerController } from './Manager/manager.controller'



@Module({
  imports: [
    // Adding config here so dotenv will be global no more import per service with @nestjs/config
    ConfigModule.forRoot({
      isGlobal: true, // makes config available app-wide
      envFilePath: '.env', // optional: default is .env
    }),
    AuthModule,
    JwtModule, 
    ManagerModule, 
    PersonModule,
    EmployeeModule
  ],
  providers: [ 
    ManagerService,
    PrismaService, 
    MailService, 
    PersonService, 
    EmployeeService, UserService,  
  ],
  controllers: [PersonController, EmployeeController, ManagerController],
})
export class AppModule {}

// implements NestModule{
//   configure(consumer: MiddlewareConsumer) {
//       consumer
//         .apply(RefreshTokenMiddleware)
//         .exclude('') //skip routes will not be included in refreshtoken session logout - 
//         .forRoutes(
//           {path: 'user-home', method: RequestMethod.GET}, // what routes are covered with refreshtokens to avoid performance hits
//           {path: 'hr/employee-create', method: RequestMethod.POST}
//         )
//         //apply for all routes -> forRoutes('*')
//   }
// }

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
