import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class ProviderLocalStrategy extends PassportStrategy(Strategy, 'providerLocal') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      session: false,
      passReqToCallback: false,
    });
  }

  async validate(email: string, password: string) {
    try {
      const user = await this.authService.ValidateProviderUser({
        email,
        password,
      });
      return user;
    } catch (err) {}
  }
}
