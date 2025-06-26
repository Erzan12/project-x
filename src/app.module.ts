import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { UserModule } from './users/users.module';
import { JwtService } from '@nestjs/jwt';
import { JwtCustomModule } from './middleware/jwt.module';
import { JwtMiddleware } from './middleware/jwt.middleware';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [AuthModule, UserModule, JwtCustomModule],
  providers: [UsersService, JwtService, PrismaService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
      // consumer.apply(JwtMiddleware).forRoutes('*') // Apply to all routes for now

      // consumer
      //   .apply(JwtMiddleware)
      //   .exclude('auth/login') // skip routes
      //   .forRoutes('*');

      //alternative approach for excluding a public route
      consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'admin/user-register', method: RequestMethod.POST },
        // Add more exclusions here if needed
      )
      .forRoutes('*');
  }
}
