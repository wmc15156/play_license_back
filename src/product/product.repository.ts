import { EntityRepository, LessThan, LessThanOrEqual, MoreThan, Not, Repository } from 'typeorm';
import { ProviderProductInfo } from './entity/ProductInfo.entity';
import { BadRequestException } from '@nestjs/common';
import { BuyerProductInfoForEdu } from './entity/BuyerProductInfoForEdu.entity';
import { BuyerProductInfo } from './entity/BuyerProductInfo.entity';
import { User } from '../user/entity/user.entity';

export class CountProduct extends ProviderProductInfo {
  count?: number;
}

@EntityRepository(ProviderProductInfo)
export class ProductRepository extends Repository<ProviderProductInfo> {
  async findProduct(product: string[]) {
   const products = await Promise.all(product.map((title) => {
     const find = this.findOne({
       where: {
         title
       }
     })
     return find;
   }));
   return products;
  }

  async getProduct(id: number):Promise<ProviderProductInfo> {
    const product = await this.findOne(id);
    if(!product) {
      throw new BadRequestException('no exist product');
    }
    product.views += 1;
    const result = await this.save(product);
    return result
  }

  async totalProduct(page: number) {
    console.log(123);
    return await this.findAndCount({
      take: 10,
      skip: page,
    });
  }

  async filteredProducts(data: string):Promise<ProviderProductInfo[]> {

    let bufferData:CountProduct[] | null = null;
    switch (data) {
      case 'register':
        bufferData = await this.createQueryBuilder('product')
          .orderBy('product.year')
          .getMany()
          break;
      case 'latest':
        bufferData = await this.createQueryBuilder('product')
          .orderBy('product.createdAt')
          .getMany()
          break;

      case 'inquiry':
        bufferData = await this.createQueryBuilder('product')
          .leftJoinAndSelect('product.buyerProducts', 'buyerProducts')
          .leftJoinAndSelect('product.buyerProductForEducation', 'education')
          .getMany()
        bufferData.map((product) => {
          product.count = product.buyerProducts.length;
          product.count += product.buyerProductForEducation.length;
          return product;
        })
        bufferData.sort((p, n) => {
          return n.count - p.count;
        })
    }

    return bufferData;
  }

  async filterData(
    totalNumber: number,
    expression: string[] | null,
    category: string,
    genre: string,
    mainAudience: string,
    sizeOfPerformance: string
  ) {
    return this.find({
      where: [
        { creativeStaff_total: !isNaN(totalNumber) ? expression ? (LessThan(totalNumber)) : Not(LessThan(totalNumber)) : MoreThan(0) },
        { category },
        { genre },
        { mainAudience },
        { sizeOfPerformance },
        ] // >=
    })
  }


}
