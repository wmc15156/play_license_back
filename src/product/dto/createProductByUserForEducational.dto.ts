import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductByUserForEducationalDto {
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
  @IsString()
  @IsNotEmpty()
  introduction: string;

  @ApiModelProperty({
    example: '교육자료개발',
    description: '활용목적',
  })
  @IsString()
  @IsNotEmpty()
  objective: string;

  @ApiModelProperty({
    example: 'A형(6개월)',
    description: '이용기간',
  })
  @IsString()
  @IsNotEmpty()
  period: string;

  @ApiModelProperty({
    example: '2020-10-20',
    description: '이용 시작일',
  })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiModelProperty({
    example: ['대본', '보컬악보'],
    description: '필요자료',
  })
  @IsNotEmpty()
  requiredMaterials: Array<string> | string;

  @ApiModelProperty({
    example: 'selectedMaterials: {selectedMaterials: [공연MR, 연습MR]}',
    description: '필요자료(선택자료들 중), type: json',
  })
  @IsNotEmpty()
  selectedMaterials: object;

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
    example: '남기는 말을 쓰세요.',
    description: '남기실 말씀',
  })
  @IsNotEmpty()
  comment: string;

  @ApiModelProperty({
    example: '교육목적용',
    description: '교육목적용, 기타목적용 두가지 선택지 중 하나',
  })
  @IsNotEmpty()
  category: string;
}
