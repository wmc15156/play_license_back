import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      session: false,
      passReqToCallback: false,
    });
  }

  async validate(email: string, password: string) {
    console.log('email', email);
    try {
      const user = await this.authService.validateUser({
        email,
        password,
      });
      return user;
    } catch (err) {}
  }
}
