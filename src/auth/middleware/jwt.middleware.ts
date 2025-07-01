// import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
// import { NextFunction, Request, Response } from 'express';
// import { JwtService } from '@nestjs/jwt';
// import { PrismaService } from '../../../prisma/prisma.service';

// @Injectable()
// export class JwtMiddleware implements NestMiddleware {
//   constructor(
//     private readonly jwtService: JwtService,
//     private readonly prisma: PrismaService,
//   ) {}

//   async use(req: Request, res: Response, next: NextFunction) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1]; // Expecting: Bearer <token>

//     if (!token) {
//       throw new UnauthorizedException('No token provided');
//     }

//     try {
//       // 1. Verify token
//       const decoded = await this.jwtService.verifyAsync(token, {
//         secret: process.env.JWT_SECRET || 'supersecretkey',
//       });

//       // 2. Find user and attach to request
//       const user = await this.prisma.user.findUnique({
//         where: { id: decoded.sub },
//         include: {
//           role: {
//             include: {
//               role_permissions: {
//                 include: { permission: true },
//               },
//             },
//           },
//           user_permissions: {
//             include: { permission: true },
//           },
//         },
//       });

//       if (!user || !user.is_active) {
//         throw new UnauthorizedException('Invalid or inactive user');
//       }

//       // Attach decoded user to request
//       (req as any).user = user;

//       next();
//     } catch (err) {
//       throw new UnauthorizedException('Invalid token');
//     }
//   }
// }
