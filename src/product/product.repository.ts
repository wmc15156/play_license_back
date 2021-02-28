import { EntityRepository, Repository } from 'typeorm';
import { ProviderProductInfo } from './entity/ProductInfo.entity';

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
   console.log(products)
   return products;
  }



}
