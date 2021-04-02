import { EntityRepository, Repository } from 'typeorm';
import { HomeBannerListsEntity } from '../entity/homeBannerLists.entity';
import { CreateBannerDto } from '../dto/createBannerDto';
import { ChangeOrderBannerDto } from '../dto/changeOrderBanner.dto';
import { BadRequestException } from '@nestjs/common';

@EntityRepository(HomeBannerListsEntity)
export class HomeBannerRepository extends Repository<HomeBannerListsEntity> {
  async createAdminBanner(createBannerDto: CreateBannerDto) {
    return await this.save({
      ...createBannerDto.bannerList,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async getBannerList() {
    return this.createQueryBuilder('homeBanner')
      .orderBy('homeBanner.order', 'ASC')
      .getMany();
  }

  async changeBannerOrder(bannerDto: ChangeOrderBannerDto) {
    const data = await this.find();
    bannerDto.bannerList.forEach((banner) => {
      data.forEach((elem) => {
        if (banner.id === elem.id) {
          elem.order = banner.order;
        }
      });
    });
    return await this.save(data);
  }

  async deleteBanner(id) {
    return this.createQueryBuilder()
      .delete()
      .from(HomeBannerListsEntity)
      .where('id = :id', { id })
      .execute();
  }

  async updateBanner(id: number, bannerDto: CreateBannerDto) {
    const data = await this.findOne(id);
    if(!data) {
      throw new BadRequestException('NO_EXIST_BANNER');
    }
    return await this.save({
      ...data,
      ...bannerDto.bannerList,
      updatedAt: new Date(),
    });
  }
}
