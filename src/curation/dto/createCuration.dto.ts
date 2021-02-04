import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCurationDto {
  @ApiModelProperty({
    example: '[베쓰맨]',
    description: '작품이름'
  })
  @IsArray()
  @IsNotEmpty()
  productTitle: [string];

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
  @IsNumber()
  @IsNotEmpty()
  order: number;

  @ApiModelProperty({
    example: 'http://imageurl.com',
    description: '유형이 스페셜일 경우 image 첨부해서 보내기'
  })
  @IsString()
  @IsOptional()
  image: string;

}
