import { IsArray, IsEmail, IsString } from 'class-validator';
import { BannerDto } from './createBannerDto';



export class GetBannerListsDto {
  @IsArray()
  bannerLists: BannerDto[];
}
