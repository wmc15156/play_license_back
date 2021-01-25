import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsEmail, IsString } from 'class-validator';
import { RolesEnum } from '../enum/Roles.enum';

export class DuplicateEmailDto {
  @ApiModelProperty({
    example: 'play@naver.com',
    description: '이메일형식',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiModelProperty({
    example: 'provider or user',
    description: '어떤 권한으로 회원가입을 하는지',
  })
  @IsString()
  provider: RolesEnum;
}
