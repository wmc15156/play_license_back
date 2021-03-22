import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

import { DotenvService } from '../../dotenv/dotenv.service';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtOauthStrategy extends PassportStrategy(Strategy, 'jwtOauth') {
  constructor(
    private readonly userService: UserService,
    private readonly dotenvConfigService: DotenvService,
  ) {
    super({
      secretOrKey: dotenvConfigService.get('JWT_SECRET_KEY'),
      jwtFromRequest: (req: Request) => {
        console.log('here', req.signedCookies);
        let token = null;
        if (req && req.signedCookies['Oauthtoken']) {
          return token;
        }
      },
    });
  }

  async validate(payload: any, done: (err: any, payload: any) => void) {
    try {
      const { userId } = payload;
      const user = await this.userService.findOneByUserId(userId, false);

      done(null, user);
    } catch (err) {
      done(err.message, false);
    }
  }
}
