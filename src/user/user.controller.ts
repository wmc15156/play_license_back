import {
  BadRequestException,
  Body,
  Controller,
  Get, HttpStatus,
  Logger,
  NotFoundException,
  Param, ParseIntPipe,
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
import { GetUser } from '../decorator/create-user.decorator';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { CreateProductByBuyerDto } from '../product/dto/createProductByBuyer.dto';
import { CreateProductByUserForEducationalDto } from '../product/dto/createProductByUserForEducational.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {
  }

  @Post('/phone-validation/:phone')
  @ApiOperation({ summary: '휴대폰 번호 인증 문자 발송' })
  @ApiResponse({ status: 201, description: 'success' })
  async sendPhoneValidationNumber(
    @Param() params: SendPhoneValidationNumberDto,
  ) {
    // response dto 생성필요
    await this.userService.sendPhoneValidationNumber(params.phone);
    return 'OK';
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

  @Get('/find/:phone')
  @ApiOperation({ summary: 'email 찾기' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  async findEmail(@Param() phoneNumber: { phone: string }) {
    const { phone } = phoneNumber;
    return this.userService.findEmail(phone);
  }

  @Get('/me')
  @ApiOperation({ summary: '로그인 여부' })
  @ApiResponse({ status: HttpStatus.OK })

  async me(@Req() req: Response, @Res() res: Response) {
    const isLogin = !!req['signedCookies']['authtoken'];
    return res.status(200).send(isLogin);
  }

  @Get('/check/password/:password')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '사용자 비밀번호 확인' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  async checkPassword(@GetUser() user, @Param() pw: { password: string }) {
    const { password } = pw;
    return this.userService.checkPassword(user, password);
  }

  @Get('/inquiry/performance/:productId')
  @ApiOperation({ summary: '사용자 구매문의 내역 데이터(공연목적용)' })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  async getInquiryForPerformance(@GetUser() user: User, @Param('productId', ParseIntPipe) id: number) {
    return await this.userService.getInquiryForPerformance(user, id);
  }

  @Get('/inquiry/education/:productId')
  @ApiOperation({ summary: '사용자 구매문의 내역 데이터(공연목적용)' })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  async getInquiryForEducation(@GetUser() user: User, @Param('productId', ParseIntPipe) id: number) {
    return await this.userService.getInquiryForEducation(user, id);
  }

  @Patch('/withdraw/:category/:productId')
  @ApiOperation({ summary: '사용자 구매문의 철회' })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  async withdrawAnInquiry(
    @GetUser() user: User,
    @Param('category') cate: string,
    @Param('productId', ParseIntPipe) id: number
  ) {
    return this.userService.withdrawAnInquiry(user, cate, id);
  }

  @Patch('/inquiry/performance/:productId')
  @ApiOperation({ summary: '사용자 구매문의 수정(공연목적용)' })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  async updateAnInquiryForPerformance(
    @GetUser() user: User,
    @Param('productId', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProductDto: CreateProductByBuyerDto
  ) {
    return this.userService.updateAnInquiryForPerformance(user, updateProductDto, id);
  }

  @Patch('/inquiry/education/:productId')
  @ApiOperation({ summary: '사용자 구매문의 수정(교육목적용)' })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  async updateAnInquiryForEducation(
    @GetUser() user: User,
    @Param('productId', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProductDto: CreateProductByUserForEducationalDto
  ) {
    return this.userService.updateAnInquiryForEducation(user, updateProductDto , id);
  }


}

