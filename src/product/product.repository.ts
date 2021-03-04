import { EntityRepository, Repository } from 'typeorm';
import { ProviderProductInfo } from './entity/ProductInfo.entity';
import { BadRequestException } from '@nestjs/common';

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

  async getProduct(title: string):Promise<ProviderProductInfo> {
    const product = await this.findOne({
      title
    });
    if(!product) {
      throw new BadRequestException('no exist product');
    }
    product.views += 1;
    const result = await this.save(product);
    return result
  }

}
