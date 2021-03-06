import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from '../user/dto/CreateUser.dto';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/Login.dto';
import { User } from '../user/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthProviderEnum } from './enum/authProvider.enum';
import { GoogleAuthGuard } from './google-auth.guard';
import { DotenvService } from '../dotenv/dotenv.service';
import { KakaoAuthGuard } from './kakao-auth-guard';
import { RoleEnum } from '../roles/typed/role.enum';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { CreateProviderDto } from './dto/createProvider.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProviderAccount } from './entity/providerAccount.entity';
import { Repository } from 'typeorm';
import { DuplicateEmailDto } from './dto/duplicateEmail.dto';
import { GetProviderUser, GetUser } from '../decorator/create-user.decorator';

@ApiTags('auth(인증)')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly dotenvConfigService: DotenvService,

    @InjectRepository(ProviderAccount)
    private readonly providerAccountRepository: Repository<ProviderAccount>,
  ) {}

  @Post('/signup')
  @ApiOperation({ summary: '회원 가입' })
  @ApiResponse({ status: 201, description: 'success' })
  @ApiResponse({ status: 409, description: 'duplicated email' })
  async signUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // service로 빼기
    let oauthId: string | null = null;
    if (req.signedCookies['Oauthtoken']) {
      const decoded = jwt.verify(
        req.signedCookies['Oauthtoken'],
        this.dotenvConfigService.get('JWT_SECRET_KEY'),
      );
      if (decoded) {
        switch (decoded['provider']) {
          case 'google':
            createUserDto.provider = AuthProviderEnum.GOOGLE;
            break;
          case 'naver':
            createUserDto.provider = AuthProviderEnum.NAVER;
            break;
          case 'kakao':
            createUserDto.provider = AuthProviderEnum.KAKAO;
            break;
        }
      }
      oauthId = decoded['oauthId'];
    }
    const createdUser = await this.authService.signUp(createUserDto, oauthId);

    // const jwtToken = await this.authService.createUserToken(
    //   createdUser.userId,
    //   createUserDto.provider,
    // );
    //
    // this.setUserTokenToCookie(res, jwtToken);
    res.clearCookie('authtoken');
    res.clearCookie('providerToken');
    res.clearCookie('Oauthtoken');
    return res.status(201).json({ success: true });
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: '로컬 로그인' })
  @ApiResponse({ status: 201, description: 'success' })
  @ApiResponse({ status: 400, description: 'oauth signup or wrong password' })
  @ApiResponse({ status: 404, description: 'user not found' })
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user as User;
    const jwt = await this.authService.createUserToken(
      user.userId,
      AuthProviderEnum.LOCAL,
      user.role.role,
    );

    const { createdAt, updatedAt, role, ...result } = user;
    result['role'] = user.role.role;

    this.setUserTokenToCookie(res, jwt);
    return res.status(201).json({ success: 'true', userInfo: result });
  }

  @Post('/provider/login')
  @UseGuards(AuthGuard('providerLocal'))
  @ApiOperation({ summary: '로컬 provider 로그인' })
  @ApiResponse({ status: 201, description: 'success' })
  @ApiResponse({ status: 400, description: 'oauth signup or wrong password' })
  @ApiResponse({ status: 404, description: 'user not found' })
  async loginByProvider(
    @Body(ValidationPipe) loginDto: LoginDto,
    @GetUser() user: ProviderAccount,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const jwt = await this.authService.createUserToken(
      user.providerId,
      AuthProviderEnum.LOCAL,
      RoleEnum.PROVIDER,
    );

    const { createdAt, updatedAt, deletedAt, ...result } = user;
    result['role'] = 'provider';

    this.setUserTokenToCookie(res, jwt, false);
    return res.status(201).json(result);
  }

  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: '구글 로그인' })
  async loginByGoogle() {}

  @Get('/kakao')
  @UseGuards(KakaoAuthGuard)
  @ApiOperation({ summary: '카카오 로그인' })
  async loginBykakao() {}

  @Get('/naver')
  @UseGuards(AuthGuard('naver'))
  @ApiOperation({ summary: '네이버 로그인' })
  async loginBynaver() {}

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: '구글에서 호출되는 콜백' })
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    return await this.handleOAuthCallback(req, res);
  }

  @Get('/kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: '카카오에서 호출되는 콜백' })
  async kakaoCallback(@Req() req: Request, @Res() res: Response) {
    return await this.handleOAuthCallback(req, res);
  }

  @Get('/naver/callback')
  @UseGuards(AuthGuard('naver'))
  @ApiOperation({ summary: '네이버에서 호출되는 콜백' })
  async naverCallback(@Req() req: Request, @Res() res: Response) {
    return await this.handleOAuthCallback(req, res);
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '로그인 한 유저정보' })
  @ApiResponse({ status: 200, description: 'success' })
  @ApiResponse({ status: 401, description: 'token is invalid' })
  @ApiResponse({ status: 404, description: 'user not found' })
  async getMe(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const userInfo = await this.authService.findUserInformation(user);
    if (userInfo['user']) {
      const { email, fullName, phone } = userInfo['user'];
      const provider = userInfo['provider'];
      return res.json({ email, fullName, phone, provider });
    } else {
      return res.status(200).json(userInfo);
    }
  }

  @Get('/provider/me')
  @UseGuards(AuthGuard('jwtByProvider'))
  @ApiOperation({ summary: '로그인 한 유저정보(provider 전용)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'success' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token is invalid',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'user not found',
  })
  async getMeByProvider(@GetProviderUser() user: ProviderAccount) {
    return await this.authService.finProviderInformation(user);
  }

  @Post('/logout')
  @ApiOperation({ summary: '사용자 로그아웃' })
  @ApiResponse({ status: 200, description: 'success' })
  @ApiResponse({ status: 401, description: 'unauthorized user' })
  async logout(@Res() res: Response) {
    res.clearCookie('authtoken', {
      secure: true,
      sameSite: 'none',
    });
    res.clearCookie('Oauthtoken', {
      secure: true,
      sameSite: 'none',
    });
    return res.status(200).send();
  }

  @Post('/provider/logout')
  @ApiOperation({ summary: '사용자 로그아웃(provider 전용)' })
  @ApiResponse({ status: 200, description: 'success' })
  @ApiResponse({ status: 401, description: 'unauthorized user' })
  async logoutByProvider(@Res() res: Response) {
    res.clearCookie('providerToken');
    return res.status(200).send();
  }

  @Delete('/unregister')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '회원탈퇴' })
  @ApiResponse({ status: 200, description: 'success' })
  @ApiResponse({ status: 401, description: 'unauthorized user' })
  @ApiResponse({ status: 404, description: 'no user' })
  async unregister(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    await this.userService.unregister(user);
    res.clearCookie('authtoken');
    return res.status(200).json({ success: true });
  }

  @Delete('/provider/unregister')
  @UseGuards(AuthGuard('jwtByProvider'))
  @ApiOperation({ summary: '회원탈퇴(provider)' })
  @ApiResponse({ status: 200, description: 'success' })
  @ApiResponse({ status: 401, description: 'unauthorized user' })
  @ApiResponse({ status: 404, description: 'no user' })
  async unregisterByProvider(
    @GetProviderUser() user: ProviderAccount,
    @Res() res: Response,
  ) {
    await this.userService.unregisterByProvider(user);
    res.clearCookie('providerToken');
    return res.status(200).json({ success: true });
  }

  @Post('/email/duplicate')
  @ApiOperation({ summary: '이메일 중복체크' })
  @ApiResponse({ status: 200, description: 'success' })
  @ApiResponse({ status: 409, description: 'duplicated email' })
  async emailDuplicateCheck(
    @Body(ValidationPipe) duplicateEmailDto: DuplicateEmailDto,
    @Res() res: Response,
  ) {
    const { email, provider } = duplicateEmailDto;
    await this.userService.emailDuplicateCheck(email, provider);
    return res.status(200).json({ success: true });
  }

  @Post('/give/authority')
  @ApiOperation({ summary: 'provider 계정 등록' })
  // @Roles(RoleEnum.ADMIN)
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse({ status: 201, description: 'success' })
  @ApiResponse({ status: 401, description: 'unauthorized' })
  @ApiResponse({ status: 409, description: 'duplicated email' })
  async giveAuthority(
    @Body(ValidationPipe) createProviderDto: CreateProviderDto,
  ): Promise<any> {
    const { email, fullName, company, password, phone } = createProviderDto;
    return await this.authService.createProvider(
      email,
      fullName,
      company,
      password,
      phone,
    );
  }

  @Post('/signup/admin')
  @ApiOperation({ summary: 'admin 계정생성,test용' })
  async adminSignUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { email, password } = createUserDto;
    await this.authService.createAdmin(email, password);
    res.send('ok');
  }

  @Get('/check/login')
  @ApiOperation({ summary: 'login 여부 확인' })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  async isLogin(@Res() res: Response) {
    return res.status(200).send(true);
  }

  setUserTokenToCookie(res: Response, token: string, skip = true) {
    let tokenName: 'authtoken' | 'providerToken' | null = null;
    tokenName = skip ? 'authtoken' : 'providerToken';
    res.cookie(tokenName, token, {
      signed: true,
      maxAge: 60 * 60 * 24 * 10000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }

  setOAuthTokenToCookie(res: Response, token: string) {
    res.cookie('Oauthtoken', token, {
      signed: true,
      maxAge: 60 * 60 * 24 * 10000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }

  async handleOAuthCallback(req: Request, res: Response) {
    const user = req.user as any;
    console.log(user, 'user');
    // User with the email has been already deleted.
    if (user.isDeleted) {
      return res.send(
        `<script>alert("이미 탈퇴한 계정입니다.");window.location.replace('https://rufree-junior-p1-sangsang-frontend-swart.vercel.app/login/select');</script>`,
      );
    }
    // TODO: 리다이렉트 주소를 환경변수로 설정이 필요해보암
    if (user.noEmail) {
      return res.send(
        `<script>alert("이메일을 제공해주셔야 합니다.");window.location.replace("https://rufree-junior-p1-sangsang-frontend-swart.vercel.app/login/select");</script>`,
      );
    }

    if (user.alreadySignedUp) {
      return res.send(
        `<script>alert("이미 다른 방식으로 가입한 이메일입니다. 해당 방법으로 로그인해주세요.");window.location.replace("https://rufree-junior-p1-sangsang-frontend-swart.vercel.app/login/select");</script>`,
      );
    }

    if (user.noUser) {
      return res.send(
        `<script>alert("해당 이메일은 가입되지 않은 이메일입니다. 회원가입을 해주세요");window.location.replace("https://rufree-junior-p1-sangsang-frontend-swart.vercel.app/signup/");</script>`,
      );
    }

    // user exists
    if (user.userId) {
      const jwt = await this.authService.createUserToken(
        user.userId,
        user.provider,
        user.role.role,
      );

      this.setUserTokenToCookie(res, jwt);
      return res.redirect(`${this.dotenvConfigService.get('URL')}`);
    }

    // oauth is validated but no user
    if (user.oauthId) {
      const oauthInfoToken = await this.authService.createOAuthInfoToken({
        oauthId: user.oauthId,
        provider: user.provider,
      });

      this.setOAuthTokenToCookie(res, oauthInfoToken);
      return res.redirect(
        `${this.dotenvConfigService.get('URL')}/signup/sns?email=${user.email}`,
      );
    }
  }
}
