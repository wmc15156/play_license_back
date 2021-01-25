import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsEmail, IsString } from 'class-validator';

export class SendEmailValidationDto {
  @ApiModelProperty({
    description: '이메일형식에 맞게 전송',
    required: true,
  })
  @IsString()
  @IsEmail()
  readonly email: string;
}
