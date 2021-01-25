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
    example: '김현진',
    description: '실무자 이름',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiModelProperty({
    example: '마당씨의 식탁',
    description: '작품명',
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
    example: '공연목적',
    description: '중개위탁',
  })
  @IsString()
  @IsNotEmpty()
  brokerageConsignment: string;

  @ApiModelProperty({
    example: '[대본, 공연MR, 연습MR, 악보, 원본포스터]',
    description: '필수제공자료',
  })
  @IsArray()
  @IsNotEmpty()
  requiredMaterials: [string];

  @ApiModelProperty({
    example: '[의상디자인, 소품디자인, 무대디잔...]',
    description: '선택제공자료',
  })
  @IsArray()
  @IsNotEmpty()
  selectMaterials: [string];

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
    example: '가족',
    description: '장르',
  })
  @IsString()
  @IsNotEmpty()
  genre: string;

  @ApiModelProperty({
    example: '유아',
    description: '주요 관람층',
  })
  @IsString()
  @IsNotEmpty()
  mainAudience: string;

  @ApiModelProperty({
    example: '전연령',
    description: '관람등급',
  })
  @IsString()
  @IsNotEmpty()
  audienceRating: string;

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
    example: true,
    description: '각색허용여부',
  })
  @IsBoolean()
  @IsNotEmpty()
  adaptedStatus: boolean;

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
      '하지만 깊은 병에 시달리는 부모님의 존재가 늘 불안한 공기를 몰고 오고, 더 이상 나아지지 않는 현실 앞에 마당 씨 또한 지쳐간다.',
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
    example: '넘버리스트',
    description: '넘버리스트?',
  })
  @IsString()
  @IsNotEmpty()
  numberList: string;

  @ApiModelProperty({
    example: true,
    description: '안내사항 체크여부',
  })
  @IsBoolean()
  @IsNotEmpty()
  isCheckInformation: boolean;
}
