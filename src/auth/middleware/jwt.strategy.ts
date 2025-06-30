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

//   async validate(payload: any) {
//     return { userId: payload.sub, role: payload.role, permissions: payload.permissions };
//   }

  //merge jwt strategy and jwt middleware -> JWT STRATEGY USE JWT PASSPORT FOR CLEANER CODES AND EASIER TO MAIN
  async validate(payload: any) { 
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

        if (!user) return null;

        return {
            id: user.id,
            username: user.username,
            role: user.role,
            user_permissions: user.user_permissions,
        }
    }

}
