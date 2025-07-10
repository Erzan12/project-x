import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from '../components/decorators/public.decorator';

@Injectable()
export class CustomJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  handleRequest(err, user, info) {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('Token already has expired');
    }
    if (err || !user) {
      throw new UnauthorizedException('Invalid or missing token');
    }
    return user;
  }
  
  //added public decorator in authcustom guard for @Public Routes ->decorators->public.decorator.ts
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
