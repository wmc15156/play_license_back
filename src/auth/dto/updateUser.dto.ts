import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiModelProperty({
    example: '01028100744',
    description: '문자열로 이루어진 숫자조합',
  })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiModelProperty({
    example: 'changedPassword123@',
  })
  @IsOptional()
  @IsString()
  password: string;
}
