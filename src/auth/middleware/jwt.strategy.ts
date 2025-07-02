import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret-key',
      passReqToCallback: true,
    });
  }
  //merge jwt strategy and jwt middleware -> JWT STRATEGY USE JWT PASSPORT FOR CLEANER CODES AND EASIER TO MAIN
  async validate(req: Request, payload: any) {
    
    console.log('Correct payload:', payload);         // Should now show { sub: 3, ... }
    console.log('payload.sub:', payload.sub);         // Should now show 3

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        role: {
          include: {
            role_permissions: { include: { permission: true } },
          },
        },
        user_permissions: { include: { permission: true } },
      },
    });

    if (!user || !user.is_active) {
      throw new UnauthorizedException('Invalid or inactive user');
    }
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      user_permissions: user.user_permissions,
    };
  }
}
