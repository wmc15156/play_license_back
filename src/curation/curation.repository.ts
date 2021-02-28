import { EntityRepository, Repository } from 'typeorm';
import { CurationInfo } from './entity/CurationInfo.entity';

@EntityRepository(CurationInfo)
export class CurationRepository extends Repository<CurationInfo> {
  async getCurations() {
    const curationData = await this.find({
      relations: ['productInfo'],
    });

    const values =  await this.createQueryBuilder("curation")
      .leftJoinAndSelect("curation.productInfo", "product")
      .select(["product.title", "product.poster", "curation.curationName", "curation.image", "product.productId"])
      .execute()

    return values;
  }

}
