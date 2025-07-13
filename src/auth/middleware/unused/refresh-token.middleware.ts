// import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
// import { Request, Response, NextFunction } from 'express';
// import { PrismaService } from "prisma/prisma.service";

// const INACTIVITY_TIMEOUT_MINUTES = 30;

// @Injectable()
// export class RefreshTokenMiddleware implements NestMiddleware {
//     constructor(private prisma: PrismaService) {}

//     async use(req: Request, res: Response, next: NextFunction) {
//         const token = req.headers['x-refresh-token'] as string; // or from cookies

//         if (!token) {
//             throw new UnauthorizedException('Refresh Token is missing');
//         }

//         const storedToken = await this.prisma.refreshToken.findUnique({
//             where : { token },
//         });

//         if (!storedToken || storedToken.revoked) {
//             throw new UnauthorizedException('Invalid or revoke Refresh Token')
//         }

//         const now = new Date();
//         const lastActive = storedToken.last_active_at ?? storedToken.created_at;
//         const diffMinutes = (now.getTime() - new Date(lastActive).getTime()) / 1000 / 60;

//         if (diffMinutes > INACTIVITY_TIMEOUT_MINUTES) {
//             await this.prisma.refreshToken.update({
//                 where: { token },
//                 data: { revoked: true }
//             });
//             throw new UnauthorizedException('Session expired due to inactivity');
//         }

//         // udpate activity timestamp
//         await this.prisma.refreshToken.update({
//             where: { token },
//             data: { last_active_at: now },
//         });

//         req['refreshToken'] = storedToken;

//         next();
//     }
// }