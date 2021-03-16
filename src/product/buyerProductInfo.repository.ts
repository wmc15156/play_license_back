import { EntityRepository, Repository } from 'typeorm';
import { BuyerProductInfo, BuyerProgressEnum } from './entity/BuyerProductInfo.entity';
import { BadRequestException } from '@nestjs/common';
import { CreateProductByBuyerDto } from './dto/createProductByBuyer.dto';

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

  async updateData(productId: number, updateProductDto: CreateProductByBuyerDto) {
    const data = await this.findOne(productId);
    data.groupName= updateProductDto.groupName;
    data.introduction= updateProductDto.introduction;
    data.planDocument= updateProductDto.planDocument;
    data.round= updateProductDto.round;
    data.place= updateProductDto.place;
    data.plan= JSON.stringify(updateProductDto.plan);
    data.price= updateProductDto.price;
    data.isChangedScenario= updateProductDto.isChangedScenario;
    data.changedRange= updateProductDto.changedRange;
    data.requiredMaterials= Array.isArray(updateProductDto.requiredMaterials) && updateProductDto.requiredMaterials.join(',');
    data.selectedMaterials= updateProductDto.selectedMaterials;
    data.participant= updateProductDto.participant;
    data.name= updateProductDto.name;
    data.phone= updateProductDto.phone;
    data.comment= updateProductDto.comment;
    data.updatedAt = new Date();
    await this.save(data);
  }

}
