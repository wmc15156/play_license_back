import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsString } from 'class-validator';

export class SendPhoneValidationNumberDto {
  @ApiModelProperty({
    description: '- 은 제거하고 숫자 전송. 예시: 01028100744',
    required: true,
  })
  @IsString()
  readonly phone: string;
}
