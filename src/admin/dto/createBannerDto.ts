import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsNotEmpty } from 'class-validator';

export type BannerDto = {
  title: string;
  exposure: boolean;
  desktopUrl: string;
  mobileUrl: string;
  order: number;
  url: string;
};

export class CreateBannerDto {
  @ApiModelProperty({
    example: {
      title: '제목',
      exposure: true,
      desktopUrl: 'url',
      mobileUrl: 'url',
      url: 'string',
    },

    description: 'banner Lists',
  })
  @IsNotEmpty()
  bannerList: BannerDto;
}
