import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductByBuyerDto {
  @ApiModelProperty({
    example: '올림푸스',
    description: '단체이름',
  })
  @IsString()
  @IsNotEmpty()
  groupName: string;

  @ApiModelProperty({
    example: '중앙대학교 연극동아리입니다.',
    description: '소속소개',
  })
  introduction: string;

  @ApiModelProperty({
    example: '졸업공연',
    description: '기획의도',
  })
  planDocument: string;

  @ApiModelProperty({
    example: {
      round: '10회차',
      startDate: '2020-10-12',
      endDate: '2020-11-12',
    },
    description: '공연회차 및 일정',
  })
  roundAndPlan: object;

  @ApiModelProperty({
    example: ['소극장', '동양아트센터'],
    description: '공연장소',
  })
  place: Array<string> | string;

  @ApiModelProperty({
    example: ['유료', '30000원/매'],
    description: '티켓가격',
  })
  price: Array<string> | string;

  @ApiModelProperty({
    example: ['각색있음', '일부만 있음'],
    description: '각색여부 및 범위',
  })
  changeScenarioAndRange: Array<string> | string;

  @ApiModelProperty({
    example: ['대본', '공연MR'],
    description: '필요자료',
  })
  requiredMaterial: Array<string> | string;

  @ApiModelProperty({
    example: { actor: '12명', staff: '21명' },
    description: '공연참여 인원',
  })
  participant: object;

  @ApiModelProperty({
    example: '김솔',
    description: '문의자 이름',
  })
  name: string;

  @ApiModelProperty({
    example: '0100000000',
    description: '문의자 연락처',
  })
  phone: string;

  @ApiModelProperty({
    example: '남기는 말을 써요.....',
    description: '남기실 말씀',
  })
  comment: string;
}
