import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const jwtService = app.get(JwtService);
  // const prisma = app.get(PrismaService);
  // app.use(new JwtMiddleware(jwtService, prisma).use);

  await app.listen(3000);
  app.useGlobalPipes(new ValidationPipe);
}
bootstrap();
