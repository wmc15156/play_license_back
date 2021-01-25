import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';

import { SendPhoneValidationNumberDto } from './dto/SendPhoneValidation.dto';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { FindByEmailQuery } from './queries/FindByPhone';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from '../auth/dto/updateUser.dto';
import { User } from './entity/user.entity';

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

  @Get('/forgot-password/by-email')
  @ApiOperation({ summary: '이메일로 패스워드 찾기' })
  async findCreatorPasswordByEmail(@Query() { email }: FindByEmailQuery) {
    await this.userService.findPasswordByEmail({
      email,
    });
  }

  @Patch('/update')
  @ApiOperation({ summary: '유저 정보수정, 수정이 필요한 정보만 요청 ' })
  @ApiResponse({ status: 200, description: 'success' })
  @ApiResponse({ status: 401, description: 'token is invalid' })
  @ApiResponse({ status: 404, description: 'no user' })
  @UseGuards(AuthGuard('jwt'))
  async updateUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    const user = req.user as User;

    const updatedUser = await this.userService.updateUser(user, updateUserDto);
    return res.status(200).json({ success: true, data: updatedUser });
  }
}
