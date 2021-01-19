import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { DotenvService } from '../../dotenv/dotenv.service';
import { AuthProviderEnum } from '../enum/authProvider.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    private readonly authService: AuthService,
    private readonly dotenvConfigService: DotenvService,
  ) {
    super({
      clientID: dotenvConfigService.get('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: dotenvConfigService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      callbackURL: dotenvConfigService.get('GOOGLE_CALL_BACK_URL'),
      passReqToCallback: true,
      scope: ['email'],
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string | undefined,
    profile: any,
    done: Function,
  ) {
    try {
      console.log('google');
      const googleLogin = await this.authService.updateGoogleLogin(
        profile.id,
        accessToken,
        refreshToken,
      );

      const email = profile.emails[0].value;

      const user = await this.authService.getUserFromOAuthLogin(
        profile.id,
        AuthProviderEnum.GOOGLE,
        email,
        done,
      );
      if (user) {
        done(null, user);
        return;
      }

      const oauthInfo = {
        provider: AuthProviderEnum.GOOGLE,
        providerLoginId: googleLogin.googleLoginId,
        oauthId: profile.id,
        email,
      };

      done(null, oauthInfo);
    } catch (error) {
      if (error.message === 'USER_DELETED') {
        done(null, { isDeleted: true });
        return;
      }

      if (error.message === 'NO_EMAIL') {
        done(null, { noEmail: true });
        return;
      }

      if (error.message === 'ALREADY_SIGNED_UP_OTHER_LOGIN') {
        done(null, { alreadySignedUp: true });
        return;
      }

      if (error.message === 'USER_NOT_FOUND') {
        done(null, { noUser: true });
      }

      done(error, false);
    }
  }
}
