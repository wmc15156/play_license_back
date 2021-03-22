import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {
  IsArray,
  IsBoolean,
  IsJSON,
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';

export interface CastMembers {
  women?: number;
  men?: number;
  children?: number;
}

export interface CreativeStaff {
  author?: string;
  writer?: string;
  composer?: string;
}


export class CreateProductDto {
  @ApiModelProperty({
    example: '푸른바다 제작사',
    description: '제작사',
  })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiModelProperty({
    example: '제작사 설명을 자유롭게 입력해주세요.',
    description: '제작사 설명',
  })
  @IsString()
  description: string;

  @ApiModelProperty({
    example: '김현진',
    description: '실무자 이름',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiModelProperty({
    example: '마당씨의 식탁',
    description: '등록할 작품명',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiModelProperty({
    example: '0100000000',
    description: '실무자 연락처',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiModelProperty({
    example: '[공연목적, 교육목적, 기타]',
    description: '중개위탁',
  })
  @IsArray()
  @IsNotEmpty()
  brokerageConsignment: string[];

  @ApiModelProperty({
    example: '2020년',
    description: '초연 연도',
  })
  @IsString()
  year: string;

  @ApiModelProperty({
    example: { select: [{name: '대본', price: '123원', originalMaterial: 'url', agreement: 'url', etc: '비고사항'}, {}, {}, {}] },
    description: '필수제공자료',
  })
  @IsNotEmpty()
  requiredMaterials: object; // // { select: [{}, {}, {}, {}]}

  @ApiModelProperty({
    example: { select: [{name: '연습MR', price: '123원', originalMaterial: 'url', agreement: 'url', etc: '비고사항'}, {}, {}, {}], input: '기타' },
    description: '선택제공자료'
  })
  @IsNotEmpty()
  selectMaterials: object;  // { select: [{}, {}, {}, {}], input: '' }

  @ApiModelProperty({
    example: '잘부탁드립니다.',
    description: '제공자가 남긴 comment',
  })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiModelProperty({
    example: '연극',
    description: '공연분야',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiModelProperty({
    example: { author: '김현진', writer: '김현진', composer: '김현진' },
    description: '창작진',
  })
  @IsObject()
  @IsNotEmpty()
  creativeStaff: CreativeStaff;

  @ApiModelProperty({
    example: ['가족', '공포'],
    description: '장르',
  })
  @IsArray()
  @IsNotEmpty()
  genre: [string];

  @ApiModelProperty({
    example: ['일반(15세~성인)', '유아용'],
    description: '주관람층',
  })
  @IsArray()
  @IsNotEmpty()
  mainAudience: [string];

  @ApiModelProperty({
    example: '소규모',
    description: '공연규모',
  })
  @IsString()
  @IsNotEmpty()
  sizeOfPerformance: string;

  @ApiModelProperty({
    example: { women: 3, men: 3, children: 1 },
    description: '출연인원',
  })
  @IsObject()
  @IsNotEmpty()
  castMembers: CastMembers;

  @ApiModelProperty({
    example: { runningTime: '1시간 30분', intermission: '30분'}
  })
  @IsObject()
  @IsNotEmpty()
  totalTime: object;

  @ApiModelProperty({
    example: '각색있음',
    description: '각색허용여부',
  })
  @IsNotEmpty()
  changeScenario: string;

  @ApiModelProperty({
    example: 'https://www.youtube.com/watch?v=example',
    description: '공연영상URL',
  })
  @IsString()
  @IsNotEmpty()
  performanceVideo: string;

  @ApiModelProperty({
    example:
      '누구에게나 있는, 하지만 누구에게나 다른 가까이 두기엔 너무나 가까운 우리 가족 이야기.',
    description: '기획의도',
  })
  @IsString()
  @IsNotEmpty()
  planningDocument: string;

  @ApiModelProperty({
    example:
      '하지만 깊은 병에 시달리는 부모님의 존재가 늘 불안한 공기를 몰고 오고, 더 이상 나아지지 않는 현실 \n ' +
      '앞에 마당 씨 또한 지쳐간다.',
    description: '시놉시',
  })
  @IsString()
  @IsNotEmpty()
  synopsis: string;

  @ApiModelProperty({
    example: 'http://posterImageUrl.com',
    description: '공연포스터 이미지 url',
  })
  @IsString()
  @IsNotEmpty()
  posterURL: string;

  @ApiModelProperty({
    example: 'http://pcBackground.com',
    description: 'pc 배경이미지',
  })
  @IsString()
  @IsNotEmpty()
  pcBackground: string;

  @ApiModelProperty({
    example: 'http://mobileBackground.com',
    description: 'mobile 배경이미지',
  })
  @IsString()
  @IsNotEmpty()
  mobileBackground: string;

  @ApiModelProperty({
    example: 'http://performanceInformationURL.com',
    description: '공연정보 url',
  })
  @IsString()
  @IsNotEmpty()
  performanceInformationURL: string;

  @ApiModelProperty({
    example: ['첫번째', '두번째', '세번째'],
    description: '넘버리스트?',
  })
  @IsArray()
  @IsNotEmpty()
  numberList: [string];

  @ApiModelProperty({
    example: 7,
    description: '출연진 총 인원수'
  })
  creativeStaff_total: number;

  @ApiModelProperty({
    example: true,
    description: '안내사항 체크여부',
  })
  @IsBoolean()
  @IsNotEmpty()
  isCheckInformation: boolean;

}
