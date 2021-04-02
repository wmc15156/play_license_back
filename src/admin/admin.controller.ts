import {
  Body,
  Controller, Delete, Get,
  HttpStatus, Param, ParseIntPipe, Patch,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAdminDto } from './dto/createAdmin';
import { AdminService } from './admin.service';
import { LoginDto } from '../auth/dto/Login.dto';
import { GetAdminUser, GetUser } from '../decorator/create-user.decorator';
import { AdminAccountEntity } from './entity/adminAccount.entity';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CreateBannerDto } from './dto/createBannerDto';
import { GetBannerListsDto } from './dto/getBannerLists.dto';
import { ChangeOrderBannerDto } from './dto/changeOrderBanner.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/login')
  @UseGuards(AuthGuard('adminLocal'))
  @ApiOperation({ summary: 'admin login ' })
  @ApiResponse({ status: 201, description: 'success' })
  @ApiResponse({ status: 400, description: 'oauth signup or wrong password' })
  @ApiResponse({ status: 404, description: 'user not found' })
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
    @GetAdminUser() user: AdminAccountEntity,
    @Res() res: Response,
  ) {
    const jwt = await this.adminService.createAdminToken(user.adminId);
    this.setUserTokenToCookie(res, jwt);
    return res.status(200).send(true);
  }


  @Post('/signup')
  @ApiOperation({ summary: 'admin 회원가입 ' })
  @ApiResponse({ status: 201, description: 'success' })
  @ApiResponse({ status: 409, description: 'duplicated email' })
  async signUp(@Body(ValidationPipe) createAdminDto: CreateAdminDto) {
    return this.adminService.signup(createAdminDto);
  }

  @Get('/home-banner')
  // @UseGuards(AuthGuard('jwtByAdmin'))
  @ApiOperation({ summary: 'banner List 정보' })
  @ApiResponse({ status: HttpStatus.OK, type: GetBannerListsDto})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  async getBannerList() {
    return this.adminService.getBannerList();
  }

  @Post('/home-banner')
  // @UseGuards(AuthGuard('jwtByAdmin'))
  @ApiOperation({ summary: 'admin 홈 배너 리스트 추가 ' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  async saveBanner(
    @Body(ValidationPipe) createBannerDto: CreateBannerDto,
    @GetAdminUser() user: AdminAccountEntity,
  ) {
    return await this.adminService.createAdminBanner(createBannerDto);
  }

  // 순서 변경

  @Patch('/home-banner/order')
  @ApiOperation({ summary: 'admin 홈 배너 순서 변경 ' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  async changeBannerOrder(
    @Body(ValidationPipe) bannerDto: ChangeOrderBannerDto,
  ) {
    console.log(bannerDto);
    return await this.adminService.changeBannerOrder(bannerDto);
  }

  //내용수정
  @Patch('/home-banner/:bannerId')
  // @UseGuards(AuthGuard('jwtByAdmin'))
  @ApiOperation({ summary: 'admin 홈 배너 리스트 내용 수정 ' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  async updateBanner(
    @Param('bannerId', ParseIntPipe) id: number,
    @Body(ValidationPipe) bannerDto: CreateBannerDto
  ) {
    return await this.adminService.updateBanner(id, bannerDto);
  }

  @Delete('/home-banner/:bannerId')
  // @UseGuards(AuthGuard('jwtByAdmin'))
  @ApiOperation({ summary: 'admin 홈 배너 리스트 삭제 ' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  async deleteBanner(
    @Param('bannerId', ParseIntPipe) id: number,
  ) {
    return await this.adminService.deleteBanner(id);
  }




  setUserTokenToCookie(res: Response, token: string) {
    let tokenName = 'adminToken';
    res.cookie(tokenName, token, {
      signed: true,
      maxAge: 60 * 60 * 24 * 10000,
      httpOnly: true,
      // secure: true,
      // sameSite: 'none',
    });
  }


}
