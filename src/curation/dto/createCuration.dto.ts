import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCurationDto {
  @ApiModelProperty({
    example: '요즘 뜨는 작품',
    description: 'curation'
  })
  @IsString()
  @IsNotEmpty()
  curation: string;

  @ApiModelProperty({
    example: 'abcd',
    description: 'curation 리스트 간 고유한 값'
  })
  @IsString()
  @IsNotEmpty()
  uniqueId: string;

  @ApiModelProperty({
    example: '디폴트',
    description: '유형 / 디폴트, 스페셜'
  })
  @IsString()
  @IsNotEmpty()
  kinds: string;

  @ApiModelProperty({
    example: '노출',
    description: '노출여부'
  })
  @IsString()
  @IsNotEmpty()
  expose: string;

  @ApiModelProperty({
    example: '1',
    description: '큐레이션 순서를 저장하기 위한 숫자, 중복되는 숫자가 있으면 안됨. / 타입: number'
  })
  @IsString()
  @IsNotEmpty()
  order: number;


}
