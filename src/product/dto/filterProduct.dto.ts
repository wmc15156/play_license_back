import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FilterProductDto {
  @ApiModelProperty({
    example: 1,
    description: '해당 작품 Id',
  })
  @IsNumber()
  @IsNotEmpty()
  product_productId: number;

  @ApiModelProperty({
    example: '올림푸스',
    description: '단체이름',
  })
  @IsString()
  @IsNotEmpty()
  product_groupName: string;

  @ApiModelProperty({
    example: '중앙대학교 연극동아리입니다.',
    description: '소속소개',
  })
  @IsString()
  @IsNotEmpty()
  product_introduction: string;

  @ApiModelProperty({
    example: { 0: '교육자료 개발' },
    description: '활용목적',
  })
  @IsNotEmpty()
  product_objective: object;

  @ApiModelProperty({
    example: 'A형(6개월)',
    description: '이용기간',
  })
  @IsString()
  @IsNotEmpty()
  product_period: string;

  @ApiModelProperty({
    example: [{ start: '2020-02-01', end: '2020-02-20' }],
    description: '이용 기간',
  })
  @IsNotEmpty()
  product_plan: object[];

  @ApiModelProperty({
    example: ['대본', '보컬악보'],
    description: '필요자료',
  })
  @IsNotEmpty()
  product_requiredMaterials: Array<string> | string;

  @ApiModelProperty({
    example: { input: 'string', select: ['str', 'str'] },
    description: '필요자료(선택자료들 중)',
  })
  @IsNotEmpty()
  product_selectedMaterials: object;

  @ApiModelProperty({
    example: '김솔',
    description: '문의자 이름',
  })
  @IsNotEmpty()
  product_name: string;

  @ApiModelProperty({
    example: '0100000000',
    description: '문의자 연락처',
  })
  @IsNotEmpty()
  product_phone: string;

  @ApiModelProperty({
    example: '남기는 말을 쓰세요.',
    description: '남기실 말씀',
  })
  @IsNotEmpty()
  product_comment: string;

  @ApiModelProperty({
    example: '교육목적용',
    description: '교육목적용, 기타목적용 두가지 선택지 중 하나',
  })
  @IsNotEmpty()
  product_category: string;

  @ApiModelProperty({
    example: '네네네',
    description: '작품이름',
  })
  providerProduct_title: string;
}
