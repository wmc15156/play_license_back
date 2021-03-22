import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { DotenvModule } from '../dotenv/dotenv.module';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginInfo } from './entity/loginInfo.entity';
import { GoogleLogin } from './entity/googleLogin.entity';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { KakaoLogin } from './entity/kakao.entity';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { NaverLogin } from './entity/naver.entity';
import { NaverStrategy } from './strategies/naver.strategy';
import { JwtOauthStrategy } from './strategies/jwtOauth.strategy';
import { User } from '../user/entity/user.entity';
import { ProviderAccount } from './entity/providerAccount.entity';
import { ProviderLocalStrategy } from './strategies/provider.local.strategy';
import { JwtProviderStrategy } from './strategies/jwt.provider.strategy';

@Module({
  imports: [
    PassportModule,
    DotenvModule,
    UserModule,
    TypeOrmModule.forFeature([
      LoginInfo,
      GoogleLogin,
      KakaoLogin,
      NaverLogin,
      User,
      ProviderAccount,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    KakaoStrategy,
    NaverStrategy,
    JwtOauthStrategy,
    ProviderLocalStrategy,
    JwtProviderStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
