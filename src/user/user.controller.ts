import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';

import { SendPhoneValidationNumberDto } from './dto/SendPhoneValidation.dto';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { FindByEmailQuery } from './queries/FindByPhone';

@ApiTags('user')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post('/phone-validation/:phone')
  @ApiOperation({ summary: '휴대폰 번호 인증 문자 발송' })
  @ApiResponse({ status: 201, description: 'success' })
  async sendPhoneValidationNumber(
    @Param() params: SendPhoneValidationNumberDto,
  ) {
    try {
      await this.userService.sendPhoneValidationNumber(params.phone);
      return 'OK';
    } catch (e) {
      throw e;
    }
  }

  @Get('/phone-validation')
  @ApiOperation({
    summary: '인증번호 유효성 검사',
    description: '회원가입 시 본인인증',
  })
  @ApiImplicitQuery({ name: 'phone', type: 'string' })
  @ApiImplicitQuery({ name: 'code' })
  @ApiResponse({ status: 404, description: 'phone number not found' })
  @ApiResponse({ status: 403, description: 'code is expired' })
  @ApiResponse({ status: 200, description: 'success' })
  async checkPhoneValidationCode(
    @Query('phone') phone: string,
    @Query('code') code: string,
    @Res() res: Response,
  ) {
    try {
      await this.userService.checkPhoneValidationCode(phone, code);
      return res.json({ success: true });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Get('/users/forgot-password/by-email')
  @ApiOperation({ summary: '이메일로 패스워드 찾기' })
  async findCreatorPasswordByEmail(@Query() { email }: FindByEmailQuery) {
    console.log(1, email);
    await this.userService.findPasswordByEmail({
      email,
    });
  }
}
