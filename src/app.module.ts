import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { JwtService } from '@nestjs/jwt';
import { JwtMiddleware } from './middleware/jwt.middleware';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [UsersService, JwtService, PrismaService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(JwtMiddleware).forRoutes('*') // Apply to all routes for now
  }
}
