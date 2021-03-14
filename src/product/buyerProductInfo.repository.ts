import { EntityRepository, Repository } from 'typeorm';
import { BuyerProductInfo } from './entity/BuyerProductInfo.entity';

@EntityRepository(BuyerProductInfo)
export class BuyerProductInfoRepository extends Repository<BuyerProductInfo> {
  async getBuyerInquiryDetails() {
    await this.createQueryBuilder('buyerProductInfoEdu')
      .leftJoin('user', 'user')
      .execute()
  }
}
