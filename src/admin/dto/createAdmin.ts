import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsEmail, IsString } from 'class-validator';

export class CreateAdminDto {
  @ApiModelProperty({
    example: 'play@naver.com',
    description: '이메일형식',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiModelProperty({
    example: '김현진',
    description: 'admin 이름',
  })
  @IsString()
  fullName: string;

  @ApiModelProperty({
    example: 'secret1@1!',
    description: '패스워드',
  })
  @IsString()
  password: string;
}
