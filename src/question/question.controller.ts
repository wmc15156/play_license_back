import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus, Param, ParseIntPipe, Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { GetProviderUser, GetUser } from '../decorator/create-user.decorator';
import { User } from '../user/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ProviderAccount } from '../auth/entity/providerAccount.entity';

@ApiTags('question')
@Controller('question')
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService
  ) {}

  @Post('/')
  @ApiOperation({ summary: '1대1문의 작성(buyer 전용)' })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
   createdQuestion(
     @Body(ValidationPipe) createQuestionDto: CreateQuestionDto,
     @GetUser() user:User
  ) {
    return this.questionService.crateQuestion(createQuestionDto)
  }

  @Post('/provider')
  @ApiOperation({ summary: '1대1문의 작성(provider 전용)' })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  createdQuestionByProvider(
    @Body(ValidationPipe) createQuestionDto: CreateQuestionDto,
    @GetUser() user:ProviderAccount
  ) {
    return this.questionService.crateQuestion(createQuestionDto, false);
  }


  @Get('/')
  @ApiOperation({ summary: '1대1문의 리스트' })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  async getQuestion(@GetUser() user:User) {
    return await this.questionService.getQuestion(user);
  }

  @Get('/provider')
  @ApiOperation({ summary: '1대1문의 리스트(제작사 전용)' })
  @UseGuards(AuthGuard('jwtByProvider'))
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  async getQuestionByProvider(@GetProviderUser() user: ProviderAccount) {
    return await this.questionService.getQuestion(user);
  }


  @Get('/:questionId')
  @ApiOperation({ summary: '1:1문의 내역 ' })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  async getOneQuestion(
    @GetUser() user:User,
    @Param('questionId', ParseIntPipe) id: number,
  ) {
    return await this.questionService.getOneQuestion(user, id);
  }

  @Patch('/provider/:questionId')
  @UseGuards(AuthGuard('jwtByProvider'))
  @ApiOperation({ summary: '1:1 문의내역수정'})
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  async modifyQuestionByProvider(
    @Body(ValidationPipe) createQuestionDto: CreateQuestionDto,
    @Param('questionId', ParseIntPipe) id: number,
    @GetUser() user:ProviderAccount,
  ) {
    return this.questionService.modifyQuestion(user, createQuestionDto, id);
  }

  @Patch('/:questionId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '1:1 문의내역수정'})
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  async modifyQuestion(
    @Body(ValidationPipe) createQuestionDto: CreateQuestionDto,
    @Param('questionId', ParseIntPipe) id: number,
    @GetUser() user:User,
  ) {
    return this.questionService.modifyQuestion(user, createQuestionDto, id);
  }



}
