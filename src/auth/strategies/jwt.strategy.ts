import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

import { DotenvService } from '../../dotenv/dotenv.service';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly dotenvConfigService: DotenvService,
    private readonly userService: UserService,
  ) {
    super({
      secretOrKey: dotenvConfigService.get('JWT_SECRET_KEY'),
      jwtFromRequest: (req: Request) => {
        let token = null;
        if (req && req.signedCookies) {
          token = req.signedCookies['authtoken']
            || req.signedCookies['Oauthtoken'];
        }
        return token;
      },
    });
  }

  async validate(payload: any, done: (err: any, payload: any) => void) {
    try {
      const { userId, role } = payload;
      const user = await this.userService.findOneByUserId(userId);
      console.log(123,user);
      this.logger.debug(
        'usertoken validated: ' + JSON.stringify(user, null, 2),
      );
      done(null, user);
    } catch (e) {
      console.error(e);
      done(e.message, false);
    }
  }
}
