import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateProviderDto {
  @ApiModelProperty({
    example: 'play@naver.com',
    description: '이메일형식',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiModelProperty({
    example: '김현진',
    description: 'provider 실무자 이름',
  })
  @IsString()
  fullName: string;

  @ApiModelProperty({
    example: 'secret1@1!',
    description: '패스워드',
  })
  @IsString()
  password: string;

  @ApiModelProperty({
    example: '푸른바다 제작사',
    description: '제작사 이름',
  })
  @IsString()
  @IsOptional()
  company: string;
}
