import {
  Body,
  Controller,
  Logger,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreateUserDto } from '../user/dto/CreateUser.dto';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: '회원 가입' })
  @ApiResponse({ status: 201, description: 'success' })
  @ApiResponse({ status: 401, description: 'duplicated email' })
  async signUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const createdUser = await this.authService.signUp(createUserDto);

    const jwtToken = await this.authService.createUserToken(
      createdUser.userId,
      createUserDto.provider,
    );

    this.setUserTokenToCookie(res, jwtToken);
    return res.json({ success: true });
  }

  setUserTokenToCookie(res: Response, token: string) {
    return res.cookie('authtoken', token, {
      signed: true,
      maxAge: 60 * 60 * 24,
      httpOnly: true,
    });
  }
}
