import { EntityRepository, Repository } from 'typeorm';
import { BuyerProductInfo, BuyerProgressEnum } from './entity/BuyerProductInfo.entity';
import { BadRequestException } from '@nestjs/common';

@EntityRepository(BuyerProductInfo)
export class BuyerProductInfoRepository extends Repository<BuyerProductInfo> {
  async getBuyerInquiryDetails() {
    await this.createQueryBuilder('buyerProductInfoEdu')
      .leftJoin('user', 'user')
      .execute()
  }

  async updateToCanceledForProgress(productId: number) {
    const data = await this.findOne(productId);

    if(!data) throw new BadRequestException('no exist production')

    data.progress = BuyerProgressEnum.CANCELED;
    data.admin_check = BuyerProgressEnum.CANCELED;
    await this.save(data);
  }

}
