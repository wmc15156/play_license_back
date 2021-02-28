import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-naver';
import { AuthService } from '../auth.service';
import { DotenvService } from '../../dotenv/dotenv.service';
import { AuthProviderEnum } from '../enum/authProvider.enum';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(
    private readonly authService: AuthService,
    private readonly dotenvConfigService: DotenvService,
  ) {
    super({
      clientID: dotenvConfigService.get('NAVER_CLIENT_ID'),
      clientSecret: dotenvConfigService.get('NAVER_CLIENT_SECRET'),
      callbackURL: `${dotenvConfigService.get('CALLBACKURL')}/api/auth/naver/callback`,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string | undefined,
    profile: Profile,
    done: Function,
  ) {
    try {
      const naverLogin = await this.authService.updateNaverLogin(
        profile.id,
        accessToken,
        refreshToken,
      );

      const email = profile.emails[0].value;

      const user = await this.authService.getUserFromOAuthLogin(
        profile.id,
        AuthProviderEnum.NAVER,
        email,
        done,
      );

      if (user) {
        done(null, user);
        return;
      }

      const oauthInfo = {
        provider: AuthProviderEnum.NAVER,
        providerLoginId: naverLogin.naverLoginId,
        oauthId: profile.id,
        email,
      };

      done(null, oauthInfo);
    } catch (err) {
      if (err.message === 'USER_DELETED') {
        done(null, { isDeleted: true });
        return;
      }

      if (err.message === 'NO_EMAIL') {
        done(null, { noEmail: true });
        return;
      }

      if (err.message === 'ALREADY_SIGNED_UP_OTHER_LOGIN') {
        done(null, { alreadySignedUp: true });
        return;
      }

      done(err, false);
    }
  }
}
