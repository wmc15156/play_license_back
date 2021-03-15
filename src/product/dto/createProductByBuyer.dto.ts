import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductByBuyerDto {

  @ApiModelProperty({
    example: 1,
    description: '해당 작품 Id',
  })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

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
  @IsNotEmpty()
  introduction: string;

  @ApiModelProperty({
    example: {0: 'string', 1: 'string'},
    description: '기획내용',
  })
  @IsNotEmpty()
  planDocument: object;

  @ApiModelProperty({
    example: [{
      startDate: '2020-10-12',
      endDate: '2020-11-12',
    }],
    description: '공연일정',
  })
  @IsNotEmpty()
  plan: object[];

  @ApiModelProperty({
    example: '5회',
    description: '공연회차',
  })
  @IsNotEmpty()
  round: string;

  @ApiModelProperty({
    example: {place_select: 'string', place_detail: 'string', place_etc: 'string'},
    description: '공연장소 type: json',
  })
  @IsNotEmpty()
  place: object;

  @ApiModelProperty({
    example: '3000원',
    description: '티켓가격,',
  })
  @IsNotEmpty()
  price: string;

  @ApiModelProperty({
    example: '각색있음',
    description: '각색여부',
  })
  @IsNotEmpty()
  isChangedScenario: string;

  @ApiModelProperty({
    example: {select: ["대사", '기타'], input: '기타내용'},
    description: '각색범위',
  })
  @IsNotEmpty()
  changedRange: object;

  @ApiModelProperty({
    example: ['대본', '보컬악보'],
    description: '필요자료',
  })
  @IsNotEmpty()
  requiredMaterials: Array<string> | string;

  @ApiModelProperty({
    example: {select: ["대사", '기타'], input: '기타내용'},
    description: '필요자료(선택자료들 중)',
  })
  @IsNotEmpty()
  selectedMaterials: object;

  @ApiModelProperty({
    example: { actor: '12명', staff: '21명' },
    description: '공연참여 인원',
  })
  @IsNotEmpty()
  participant: object;

  @ApiModelProperty({
    example: '김솔',
    description: '문의자 이름',
  })
  @IsNotEmpty()
  name: string;

  @ApiModelProperty({
    example: '0100000000',
    description: '문의자 연락처',
  })
  @IsNotEmpty()
  phone: string;

  @ApiModelProperty({
    example: '남기는 말을 써요.....',
    description: '남기실 말씀',
  })
  @IsNotEmpty()
  comment: string;
}
