import { BadRequestException, Body, Controller, HttpStatus, Post, ValidationPipe } from '@nestjs/common';
import { QuestionService } from './question.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateQuestionDto } from './dto/createQuestion.dto';

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
  async createdQuestion(@Body(ValidationPipe) createQuestionDto: CreateQuestionDto) {
    return await this.questionService.crateQuestion(createQuestionDto)
  }

}
