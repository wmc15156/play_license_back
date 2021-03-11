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

    let bufferData:ProviderProductInfo[] | null = null;
    console.log(data);
    switch (data) {
      case 'register':
        console.log(data);
        bufferData = await this.createQueryBuilder('product')
          .orderBy('product.year')
          .getMany()
          break;
      case 'latest':
        bufferData = await this.createQueryBuilder('product')
          .orderBy('product.createdAt')
          .getMany()
    }

    return bufferData;
  }

}
