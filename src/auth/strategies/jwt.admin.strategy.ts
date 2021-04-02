import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

import { DotenvService } from '../../dotenv/dotenv.service';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(
  Strategy,
  'jwtByAdmin',
) {
  private readonly logger = new Logger(JwtAdminStrategy.name);

  constructor(
    private readonly dotenvConfigService: DotenvService,
    private readonly userService: UserService,
  ) {
    super({
      secretOrKey: dotenvConfigService.get('JWT_SECRET_KEY'),
      jwtFromRequest: (req: Request) => {
        let token = null;
        if (req.signedCookies && req.signedCookies['adminToken']) {
          token = req.signedCookies['adminToken'];
        }
        return token;
      },
    });
  }

  async validate(payload: any, done: (err: any, payload: any) => void) {
    try {
      const { adminId, role } = payload;
      const user = await this.userService.findOneByAdminId(adminId);

      this.logger.debug(
        'adminToken validated: ' + JSON.stringify(user, null, 2),
      );
      done(null, user);
    } catch (e) {
      console.error(e);
      done(e.message, false);
    }
  }
}
