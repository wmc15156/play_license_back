import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';
import { AuthService } from '../auth.service';
import { DotenvService } from '../../dotenv/dotenv.service';
import { AuthProviderEnum } from '../enum/authProvider.enum';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  private readonly logger = new Logger(KakaoStrategy.name);

  constructor(
    private readonly authService: AuthService,
    private readonly dotenvConfigService: DotenvService,
  ) {
    super({
      clientID: dotenvConfigService.get('KAKAO_CLIENT_ID'),
      callbackURL: `${dotenvConfigService.get('URL')}/api/auth/kakao/callback`,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string | undefined,
    profile: Profile,
    done: Function,
  ) {
    try {
      const kakaoLogin = await this.authService.updateKakaoLogin(
        profile.id,
        accessToken,
        refreshToken,
      );

      this.logger.log(`${profile}, this is kakao Profile test`);
      const email = profile['_json'].kakao_account.email || '';

      const user = await this.authService.getUserFromOAuthLogin(
        profile.id,
        AuthProviderEnum.KAKAO,
        email,
        done,
      );
      if (user) {
        done(null, user);
        return;
      }

      const oauthInfo = {
        provider: AuthProviderEnum.KAKAO,
        providerLoginId: kakaoLogin.kakaoLoginId,
        oauthId: profile.id,
        email,
      };

      done(null, oauthInfo);
    } catch (err) {
      console.log('error');
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
