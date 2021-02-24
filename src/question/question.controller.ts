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
import { GetUser } from '../decorator/create-user.decorator';
import { User } from '../user/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('question')
@Controller('question')
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService
  ) {}



  @Post('/')
  @ApiOperation({ summary: '1대1문의 작성' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
   createdQuestion(@Body(ValidationPipe) createQuestionDto: CreateQuestionDto) {
    return this.questionService.crateQuestion(createQuestionDto)
  }

  @Get('/')
  @ApiOperation({ summary: '1대1문의 리스트' })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  async getQuestion(@GetUser() user:User) {
    console.log('213123123');
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
