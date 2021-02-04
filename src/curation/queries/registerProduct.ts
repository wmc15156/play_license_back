import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsString } from 'class-validator';

export class RegisterProductQuery {
  @ApiModelProperty({
    example: '요즘 핫한 작품',
    description: '큐레이션 명'
  })
  @IsString()
  curationName: string;

}
