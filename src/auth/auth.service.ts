import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { DotenvService } from '../dotenv/dotenv.service';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginInfo } from './entity/loginInfo.entity';
import { Repository } from 'typeorm';
import { GoogleLogin } from './entity/googleLogin.entity';
import { User } from '../user/entity/user.entity';
import { AuthProviderEnum } from './enum/authProvider.enum';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly dotEnvConfigService: DotenvService,

    @InjectRepository(LoginInfo)
    private readonly loginInfoRepository: Repository<LoginInfo>,
    @InjectRepository(GoogleLogin)
    private readonly googleLoginRepository: Repository<GoogleLogin>,
  ) {}

  async signUp(createUserDto) {
    const { provider, providerLoginId } = createUserDto;
    try {
      if (provider !== AuthProviderEnum.LOCAL && !providerLoginId) {
        throw new BadRequestException('MISSING_PROVIDER_LOGIN_ID');
      }
      const createdUser = await this.userService.create(createUserDto);

      const newLoginInfo = await this.loginInfoRepository.save({
        provider: provider,
        user: createdUser,
      });

      return createdUser;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async createUserToken(userId: number, provider: AuthProviderEnum) {
    const payload = { userId, provider };
    this.logger.log(
      `this.dotEnvConfigService.get('JWT_SECRET_KEY${this.dotEnvConfigService.get(
        'JWT_SECRET_KEY',
      )}`,
    );
    const jwt: string = sign(
      payload,
      this.dotEnvConfigService.get('JWT_SECRET_KEY'),
      {
        expiresIn: '1d',
      },
    );
    return jwt;
  }
}
