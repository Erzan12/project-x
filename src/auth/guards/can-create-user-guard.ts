//mapped user.employee.position
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../prisma/prisma.service'; // Adjust path
import { CreateUserAccount } from '../components/decorators/global.enums.decorator';
import { IS_PUBLIC_KEY } from '../components/decorators/public.decorator';

@Injectable()
export class CanCreateUserGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  // MAPPED POSITION INSTEAD OF ROLE BECAUSE ROLE AND POSITION ARE DIFFERENT BASED ON THE V2 SYSTEM 
  // ROLE INFOMRATION TECHNOLOGY IS DIFFERENT FRON POSITION IT MANAGER 
  // AND ONLY MANAGERS AND ADMISTRATORS ARE ALLOWED TO CREATE NEW USER ACCOUNT
  async canActivate(context: ExecutionContext): Promise<boolean> {

    //must be applied to all guard and it should be at top so that the @Public will mapped first and will not return unauthorized
    //added public decorator in authcustom guard for @Public Routes ->decorators->public.decorator.ts
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user; // assuming you're using JWT AuthGuard

    if (!user) {
      throw new ForbiddenException('Unauthorized');
    }

    console.log('Decoded user in guard:', user);

    // Get full user with position
    const userWithPosition = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        employee: {
          include: {
            position: true,
          },
        },
      },
    });

    if(!userWithPosition){
      throw new ForbiddenException('User not found')
    }

    const positionName = userWithPosition.employee.position.name;

    const allowedPositions: string[] = Object.values(CreateUserAccount);

    if (!allowedPositions.includes(positionName)) {
      throw new ForbiddenException(`Position "${positionName}" not allowed to create users`);
    }

    return true;
  }
}

//mapped user.role
// import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
// import { RequestWithUser } from 'src/Auth/components/interfaces/request-with-user.interface';
// import { canUserCreateAccounts } from 'src/Auth/components/commons/permissions/create-user-permission.helper';

// @Injectable()
// export class CanCreateUserGuard implements CanActivate {
//   canActivate(context: ExecutionContext): boolean {
//     const request = context.switchToHttp().getRequest<RequestWithUser>();
//     const userPosition = request.user?.role;

//     if (!canUserCreateAccounts(userPosition)) {
//       throw new ForbiddenException('You are not allowed to create user accounts.');
//     }

//     return true;
//   }
// }
