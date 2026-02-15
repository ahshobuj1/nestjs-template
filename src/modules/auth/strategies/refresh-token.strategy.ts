import { Injectable } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      secretOrKey: 'REFRESH_SECRET',

      passReqToCallback: true,
    });
  }

  validate(req: any, payload: any) {
    const refreshToken = req.headers.authorization.replace('Bearer', '').trim();

    return {
      ...payload,
      refreshToken,
    };
  }
}
