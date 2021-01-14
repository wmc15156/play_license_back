import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { DotenvModule } from '../dotenv/dotenv.module';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginInfo } from './entity/loginInfo.entity';
import { GoogleLogin } from './entity/googleLogin.entity';

@Module({
  imports: [
    PassportModule,
    DotenvModule,
    UserModule,
    TypeOrmModule.forFeature([LoginInfo, GoogleLogin]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
