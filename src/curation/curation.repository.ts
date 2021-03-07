import { EntityRepository, Repository } from 'typeorm';
import { CurationInfo } from './entity/CurationInfo.entity';
import { createEvalAwarePartialHost } from 'ts-node/dist/repl';

@EntityRepository(CurationInfo)
export class CurationRepository extends Repository<CurationInfo> {
  async getCurations() {
    const curationData = await this.find({
      relations: ['productInfo'],
    });

    const values =  await this.createQueryBuilder("curation")
      .leftJoinAndSelect("curation.productInfo", "product")
      .select([
        "product.title",
        "product.poster",
        "curation.curationName",
        "curation.image",
        "product.productId",
        "product.company",
        "product.category",
        "product.year",
        "product.brokerageConsignment",
        "product"
      ])

      .execute()
    return values;
  }

  async filterCurations(title: string, page: number) {
    // return await this.createQueryBuilder('curation')
    //   .leftJoinAndSelect('curation.productInfo', 'productInfo')
    //   .skip(page)
    //   .take(10)
    //   .orderBy('curation.curationId', 'ASC')
    //   .where('curation.curationName = :title', { title })
    //   .getMany();
    return this.findAndCount({
      relations:['productInfo'],
      where: { curationName: title},
      take: 10,
      skip: page,
    })
  }

}
