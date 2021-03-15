import { EntityRepository, Repository } from 'typeorm';
import { BuyerProgressEnum } from './entity/BuyerProductInfo.entity';
import { BadRequestException } from '@nestjs/common';
import { BuyerProductInfoForEdu } from './entity/BuyerProductInfoForEdu.entity';

@EntityRepository(BuyerProductInfoForEdu)
export class BuyerProductInfoForEduRepository extends Repository<BuyerProductInfoForEdu> {


  async updateToCanceledForProgress(productId: number) {
    const data = await this.findOne(productId);
    console.log(data);
    if(!data) throw new BadRequestException('no exist production')

    data.progress = BuyerProgressEnum.CANCELED;
    data.admin_check = BuyerProgressEnum.CANCELED;
    await this.save(data);
  }

}
