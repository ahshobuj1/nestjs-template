import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.refreshToken, // read token from cookie
      ]),
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET')!,
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
