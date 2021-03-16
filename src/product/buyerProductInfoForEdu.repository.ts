import { EntityRepository, Repository } from 'typeorm';
import { BuyerProgressEnum } from './entity/BuyerProductInfo.entity';
import { BadRequestException } from '@nestjs/common';
import { BuyerProductInfoForEdu } from './entity/BuyerProductInfoForEdu.entity';
import { CreateProductByBuyerDto } from './dto/createProductByBuyer.dto';
import { CreateProductByUserForEducationalDto } from './dto/createProductByUserForEducational.dto';

@EntityRepository(BuyerProductInfoForEdu)
export class BuyerProductInfoForEduRepository extends Repository<BuyerProductInfoForEdu> {


  async updateToCanceledForProgress(productId: number) {
    const data = await this.findOne(productId);
    if(!data) throw new BadRequestException('no exist production')

    data.progress = BuyerProgressEnum.CANCELED;
    data.admin_check = BuyerProgressEnum.CANCELED;
    await this.save(data);
  }

  async updateData(productId: number, updateProductDto: CreateProductByUserForEducationalDto) {
    const data = await this.findOne(productId);
    data.groupName= updateProductDto.groupName;
    data.introduction= updateProductDto.introduction;
    data.objective= updateProductDto.objective;
    data.plan= JSON.stringify(updateProductDto.plan);
    data.period= updateProductDto.period;
    data.requiredMaterials= Array.isArray(updateProductDto.requiredMaterials) && updateProductDto.requiredMaterials.join(',');
    data.selectedMaterials= updateProductDto.selectedMaterials;
    data.name= updateProductDto.name;
    data.phone= updateProductDto.phone;
    data.comment= updateProductDto.comment;
    data.category = updateProductDto.category;
    data.updatedAt = new Date();
    await this.save(data);
  }

}
