import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.refreshToken, // read token from cookie
      ]),
      secretOrKey: 'REFRESH_SECRET',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    // Find user in database
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });
    if (!user) return null;

    return { id: user.id, email: user.email, role: user.role };
  }
}

// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';

// @Injectable()
// export class RefreshTokenStrategy extends PassportStrategy(
//   Strategy,
//   'jwt-refresh',
// ) {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

//       secretOrKey: 'REFRESH_SECRET',

//       passReqToCallback: true,
//     });
//   }

//   validate(req: any, payload: any) {
//     const refreshToken = req.headers.authorization.replace('Bearer', '').trim();

//     return {
//       ...payload,
//       refreshToken,
//     };
//   }
// }
