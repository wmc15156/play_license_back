import {
  Body,
  Controller,
  Delete,
  Get, HttpStatus,
  Logger,
  Post,
  Req,
  Res, UnauthorizedException,
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
import { RolesEnum } from './enum/Roles.enum';
import { constants } from 'http2';


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
    console.log('---', createUserDto, req.signedCookies);
    let oauthId: string | null = null;
    if (req.signedCookies['Oauthtoken']) {
      const decoded = jwt.verify(
        req.signedCookies['Oauthtoken'],
        this.dotenvConfigService.get('JWT_SECRET_KEY'),
      );
      console.log('decode');
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
    console.log(3);
    const createdUser = await this.authService.signUp(createUserDto, oauthId);

    // const jwtToken = await this.authService.createUserToken(
    //   createdUser.userId,
    //   createUserDto.provider,
    // );
    //
    // this.setUserTokenToCookie(res, jwtToken);
    res.clearCookie('authtoken');
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

    const { createdAt, updatedAt, deletedAt, role, ...result } = user;
    result['role'] = user.role.role;

    this.setUserTokenToCookie(res, jwt);
    return res.status(201).json({ success: 'true', userInfo: result });
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
    console.log('here');
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

  @Post('/logout')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '사용자 로그아웃' })
  @ApiResponse({ status: 200, description: 'success' })
  @ApiResponse({ status: 401, description: 'unauthorized user' })
  async logout(@Res() res: Response) {
    res.clearCookie('authtoken');
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
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse({ status: 201, description: 'success' })
  @ApiResponse({ status: 401, description: 'unauthorized' })
  @ApiResponse({ status: 409, description: 'duplicated email' })
  async giveAuthority(
    @Body(ValidationPipe) createProviderDto: CreateProviderDto,
  ): Promise<ProviderAccount> {
    const { email, fullName, company, password } = createProviderDto;
    return await this.authService.createProvider(
      email,
      fullName,
      company,
      password,
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
  @ApiOperation({ summary: 'login 여부 확인'})
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse( { status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  async isLogin(@Res() res: Response) {
    return res.status(200).send(true);
  }


  setUserTokenToCookie(res: Response, token: string) {
    res.cookie('authtoken', token, {
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
      return res.redirect(`${this.dotenvConfigService.get('URL')}/signup/sns?email=${user.email}`);
    }
  }
}
