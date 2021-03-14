import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

import { GoogleLogin } from './entity/googleLogin.entity';
import { User } from '../user/entity/user.entity';
import { AuthProviderEnum } from './enum/authProvider.enum';
import { DotenvService } from '../dotenv/dotenv.service';
import { UserService } from '../user/user.service';
import { LoginInfo } from './entity/loginInfo.entity';
import { CreateUserDto } from '../user/dto/CreateUser.dto';
import { KakaoLogin } from './entity/kakao.entity';
import { NaverLogin } from './entity/naver.entity';
import { ProviderAccount } from './entity/providerAccount.entity';
import { RoleEnum } from '../roles/typed/role.enum';

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
    @InjectRepository(KakaoLogin)
    private readonly kakaoLoginRepository: Repository<KakaoLogin>,
    @InjectRepository(NaverLogin)
    private readonly naverLoginRepository: Repository<NaverLogin>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ProviderAccount)
    private readonly providerRepository: Repository<ProviderAccount>,
  ) {}

  async signUp(createUserDto: CreateUserDto, oauthId?: string) {
    const { provider } = createUserDto;
    console.log(createUserDto, oauthId);
    try {
      // if (provider !== AuthProviderEnum.LOCAL && !provider) {
      //   throw new BadRequestException('MISSING_PROVIDER');
      // }

      const createdUser = await this.userService.create(createUserDto);
      console.log(createdUser);

      if (provider === AuthProviderEnum.LOCAL) {
        await this.loginInfoRepository.save({
          user: createdUser,
        });
      }

      if (provider !== AuthProviderEnum.LOCAL) {
        const newLoginInfo = await this.loginInfoRepository.save({
          provider: provider,
          user: createdUser,
        });

        switch (provider) {
          case AuthProviderEnum.GOOGLE:
            console.log(oauthId, 'oauthId');
            const googleLogin = await this.googleLoginRepository.findOne({
              where: {
                oauthId,
              },
            });
            console.log(googleLogin,'here');
            googleLogin.loginInfo = newLoginInfo;
            await this.googleLoginRepository.save(googleLogin);
            break;
          case AuthProviderEnum.KAKAO:
            const kakaoLogin = await this.kakaoLoginRepository.findOne({
              where: {
                oauthId,
              },
            });
            kakaoLogin.loginInfo = newLoginInfo;
            await this.kakaoLoginRepository.save(kakaoLogin);
            break;
          case AuthProviderEnum.NAVER:
            const naverLogin = await this.naverLoginRepository.findOne({
              where: {
                oauthId,
              },
            });
            naverLogin.loginInfo = newLoginInfo;
            await this.naverLoginRepository.save(naverLogin);
            break;
        }
      }
      return createdUser;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async createUserToken(
    userId: number,
    provider: AuthProviderEnum,
    role?: RoleEnum,
  ) {
    let payload = null;
    if (role) {
      payload = { userId, provider, role };
    } else {
      payload = { userId, provider };
    }

    const jwt: string = sign(
      payload,
      this.dotEnvConfigService.get('JWT_SECRET_KEY'),
      {
        expiresIn: '1d',
      },
    );
    return jwt;
  }

  async validateUser({ email, password }: { email: string; password: string }) {
    const user = await this.userService.findOneWithPrivateInfo(email);

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    if (!user.password) {
      throw new BadRequestException('OAUTH_SIGNUP');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch)
    if (isMatch) {
      const { password: userPasswd, ...result } = user;
      // 패스워드를 제외한 나머지 데이터 return
      return result;
    } else {
      throw new BadRequestException('WRONG_PASSWORD');
    }
  }

  async updateGoogleLogin(
    oauthId: string,
    accessToken: string,
    refreshToken: string | undefined,
  ): Promise<GoogleLogin> {
    try {
      const existUser = await this.googleLoginRepository.findOne({
        where: { oauthId },
      });

      if (existUser) {
        existUser.accessToken = accessToken;
        existUser.refreshToken = refreshToken;

        return await this.googleLoginRepository.save(existUser);
      }
      const newGoogleLogin = await this.googleLoginRepository.save({
        oauthId,
        accessToken,
        refreshToken,
      });

      // const loginInfo = new LoginInfo();
      // loginInfo.provider = AuthProviderEnum.GOOGLE;
      // loginInfo.createdAt = new Date();
      // await this.loginInfoRepository.save(loginInfo);
      //
      // const newGoogleLogin = await this.googleLoginRepository.save({
      //   oauthId,
      //   accessToken,
      //   refreshToken,
      //   loginInfo: loginInfo,
      // });

      return newGoogleLogin;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateKakaoLogin(
    oauthId: string,
    accessToken: string,
    refreshToken: string | undefined,
  ): Promise<KakaoLogin> {
    const existUser = await this.kakaoLoginRepository.findOne({
      where: { oauthId },
    });

    if (existUser) {
      existUser.accessToken = accessToken;
      existUser.refreshToken = refreshToken;
      return await this.kakaoLoginRepository.save(existUser);
    }
    const newKakaoUser = await this.kakaoLoginRepository.save({
      oauthId,
      accessToken,
      refreshToken,
    });

    return newKakaoUser;
  }

  async updateNaverLogin(
    oauthId: string,
    accessToken: string,
    refreshToken: string | undefined,
  ): Promise<NaverLogin> {
    const existUser = await this.naverLoginRepository.findOne({ oauthId });

    if (existUser) {
      existUser.accessToken = accessToken;
      existUser.refreshToken = refreshToken;

      return await this.naverLoginRepository.save(existUser);
    }

    const newNaverUser = await this.naverLoginRepository.save({
      oauthId,
      accessToken,
      refreshToken,
    });

    return newNaverUser;
  }

  async getUserFromOAuthLogin(
    oauthId: string,
    provider: AuthProviderEnum,
    email: string,
    done: Function,
  ): Promise<User | null> {
    let loginInfo: LoginInfo | null = null;
    switch (provider) {
      case AuthProviderEnum.GOOGLE:
        const googleLogin = await this.googleLoginRepository.findOne({
          where: {
            oauthId,
          },
          relations: ['loginInfo'], // 외부키 null일시 loginInfo: null로 내려옴.
        });

        if (googleLogin && googleLogin.loginInfo) {
          loginInfo = googleLogin.loginInfo;
        }
        break;
      case AuthProviderEnum.KAKAO:
        const kakaoLogin = await this.kakaoLoginRepository.findOne({
          where: {
            oauthId,
          },
          relations: ['loginInfo'],
        });

        if (kakaoLogin && kakaoLogin.loginInfo) {
          loginInfo = kakaoLogin.loginInfo;
        }
        break;
      case AuthProviderEnum.NAVER:
        const naverLogin = await this.naverLoginRepository.findOne({
          where: {
            oauthId,
          },
          relations: ['loginInfo'],
        });
        if (naverLogin && naverLogin.loginInfo) {
          loginInfo = naverLogin.loginInfo;
        }
        break;
    }
    if (loginInfo) {
      const loginInfoWithUser = await this.loginInfoRepository.findOne(
        loginInfo.loginInfoId,
        {
          relations: ['user'],
        },
      );

      try {
        const foundUser = await this.userService.findOneByUserId(
          loginInfoWithUser.user.userId,
        );
        return foundUser;
      } catch (error) {
        done(null, { alreadySignedUp: true });
        throw new Error('USER_DELETED');
      }
    }

    // email 이 없는 경우
    if (!email && provider !== AuthProviderEnum.KAKAO) {
      throw new Error('NO_EMAIL');
    }

    // 해당 sns로 가입하지 않았는데 email로 찾아보니 가입이 되어있음.
    const isHavingEmail = await this.userService.findByEmailByIncludingDeleted(
      email,
    );

    console.log('SHIT' + JSON.stringify(isHavingEmail, null, 2));

    if (isHavingEmail) {
      // if (isHavingEmail.deletedAt === null) {
      //   throw new Error('ALREADY_SIGNED_UP_OTHER_LOGIN');
      // }
      throw new Error('USER_DELETED');
    }
    return null;
  }

  async createOAuthInfoToken(payload: {
    oauthId: string;
    provider: AuthProviderEnum;
  }): Promise<string> {
    const jwt: string = sign(
      payload,
      this.dotEnvConfigService.get('JWT_SECRET_KEY'),
      {
        expiresIn: '1d',
      },
    );

    return jwt;
  }

  async findUserInformation(user: User) {
    try {
      const { userId } = user;
      const oneUser = await this.userRepository.findOne({
        where: { userId, deletedAt: null },
        relations: ['role'],
      });
      console.log(oneUser.role.role);
      if (oneUser) {
        if (oneUser.role.role === RoleEnum.USER) {
          const loginInfo = await this.loginInfoRepository.findOne({
            where: { user: userId },
            relations: ['user'],
          });
          if (loginInfo) {
            return loginInfo;
          }
        } else {
          return oneUser;
        }
      } else {
        throw new NotFoundException('NO_USER');
      }
    } catch (err) {
      throw err;
    }
  }

  async createProvider(
    email: string,
    fullName: string,
    company: string,
    password: string,
  ) {
    try {
      const findProvider = await this.providerRepository.findOne({
        email,
      });

      const findUser = await this.userRepository.findOne({
        email,
      });

      if (findProvider || findUser) {
        throw new ConflictException('DUPLICATED_EMAIL');
      }
      const hashedPassword = this.userService.hashPassword(password);

      return await this.providerRepository.save({
        email,
        fullName,
        company,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async createAdmin(email: string, password: string): Promise<User> {
    try {
      const createAdminUser = await this.userService.createAdmin(
        email,
        password,
      );
      return createAdminUser;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
