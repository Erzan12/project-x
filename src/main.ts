import { NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesPermissionsGuard } from './Auth/guards/roles-permissions.guard';
import { PrismaService } from 'prisma/prisma.service';
import { CanCreateUserGuard } from './Auth/guards/can-create-user-guard';

class JwtAuthGuard extends AuthGuard('jwt') {}

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);


  await app.listen(3000);

  //enable validation pipe globally -> This ensures the DTOs and decorators (@ValidateNested, @IsDateString, etc.) work properly and transform inputs like date strings into Date objects where necessary.
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  //appliead jwt auth guard and role permission guard globally
  const reflector = app.get(Reflector);
  const prisma = app.get(PrismaService);

  app.useGlobalGuards(
    new JwtAuthGuard(),
    new RolesPermissionsGuard(reflector, prisma),
  );
  
}
bootstrap();
