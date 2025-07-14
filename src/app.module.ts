import { Module} from '@nestjs/common';
import { AuthModule } from './Auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { MailService } from './Mail/mail.service';
import { ConfigModule } from '@nestjs/config';
import { PersonService } from './HR/Person/person.service';
import { PersonController } from './HR/Person/person.controller';
import { PersonModule } from './HR/Person/person.module';
import { EmployeeService } from './HR/Employee/employee.service';
import { EmployeeController } from './HR/Employee/employee.controller';
import { EmployeeModule } from './HR/Employee/employee.module';
// import { ManagerService } from './Manager/manager.service';
// import { ManagerModule } from './Manager/manager.module';
import { UserService } from './User/user.service';
import { AdministratorController } from 'src/Administrator/administrator.controller';
import { AdministratorService } from 'src/Administrator/administrator.service';
import { AdministratorModule } from 'src/Administrator/administrator.module';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from './Auth/guards/permissions.guard';
import { CustomJwtAuthGuard } from './Auth/middleware/jwt.auth.guard';
import { UserModule } from './User/user.module';
import { MasterController } from './Master/master.controller';
import { PositionService } from './Master/position/position.service';
import { MasterModule } from './Master/master.module';
import { DepartmentService } from './Master/department/department.service';
import { CreatePositionDto } from './Master/position/dto/create-position.dto';
import { CreateDepartmentDto } from './Master/department/dto/create-dept.dto';
import { CaslModule } from './casl/casl.module';
import { CaslAbilityService } from './casl/casl.service';
import { HrController } from './HR/hr.controller';
import { HrService } from './HR/hr.service';
import { HrModule } from './HR/hr.module';

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
    // ManagerModule, 
    PersonModule,
    EmployeeModule,
    AdministratorModule,
    MasterModule,
    CaslModule,
    HrModule
  ],
  providers: [ 
    // ManagerService,
    UserService,
    PrismaService,
    {
      //global custom auth guard
      provide: APP_GUARD,
      useClass: CustomJwtAuthGuard,
    },
    // {
    //   //global roles permission guard
    //   provide: APP_GUARD,
    //   useClass: PermissionsGuard,
    // },
    MailService, 
    PersonService, 
    EmployeeService, UserService, AdministratorService, PositionService, DepartmentService, CreateDepartmentDto, CreatePositionDto, CaslAbilityService, HrService
  ],
  controllers: [PersonController, EmployeeController, AdministratorController, MasterController, HrController],
})
export class AppModule {}

// implements NestModule{
//   configure(consumer: MiddlewareConsumer) {
//       consumer
//         .apply(Authenticated)
//         .exclude({path: 'auth/login', method: RequestMethod.POST}) //skip routes will not be included in refreshtoken session logout - 
//         .forRoutes('*')
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
