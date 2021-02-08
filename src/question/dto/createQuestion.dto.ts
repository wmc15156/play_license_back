import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiOperation } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiModelProperty({
    example: '김현진',
    description: '문의자 이름',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiModelProperty({
    example: 'wmc151567@gmail.com',
    description: '이메일'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiModelProperty({
    example: '010000000',
    description: '-를 제외한 문자열'
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiModelProperty({
    example: '구매문의 요청',
    description: '제목'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiModelProperty({
    example: '문의내용......',
    description: '문의내용'
  })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiModelProperty({
    example: 'true',
    description: '개인정보취급방침에 동의 체크여부/ Boolean 값'
  })
  isChecked: boolean
}
