import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurationInfo } from './entity/CurationInfo.entity';
import { Repository } from 'typeorm';
import { CreateCurationDto } from './dto/createCuration.dto';
import { ProviderProductInfo } from '../product/entity/ProductInfo.entity';
import { Curation } from './interface/curation.interface';
import { CurationRepository } from './curation.repository';
import { ProductRepository } from '../product/product.repository';


@Injectable()
export class CurationService {
  constructor(
    @InjectRepository(CurationInfo)
    private readonly curationRepository: Repository<CurationInfo>,
    @InjectRepository(ProviderProductInfo)
    private readonly providerProductRepository: Repository<ProviderProductInfo>,
    @InjectRepository(CurationRepository)
    private readonly curationRepo: CurationRepository,
    @InjectRepository(ProductRepository)
    private readonly productRepo: ProductRepository,
  ) {}

  async createCuration(createCurationDto: CreateCurationDto, curationName: string) {
    const { uniqueId, kinds, order, expose, image, productTitle } = createCurationDto;
    try {

      const created = await Promise.all(productTitle.map((title) => {
        const data =  this.providerProductRepository.findOne({
          where: { title },
        });
        return data;
      }));

      if(created.includes(undefined)) {
        throw new BadRequestException('NO_EXIST_PRODUCT');
      }
      console.log(created)

      // 기존작품 똑같은 curation에 등록할 필요가 있는지 확인이 필요
      // created에 있는 curations에 있는 배열돌면서 에러처리하면 될듯

      const data = await Promise.all( created.map( (prod) => {
        console.log(prod)
        return this.curationRepository.save({
          curationName,
          uniqueId,
          kinds,
          expose,
          order,
          image: image ? image : null,
          productInfo: [prod]
        });
      }));


      // await this.curationRepository.save({
      //   curationName,
      //   uniqueId,
      //   kinds,
      //   expose,
      //   order,
      //   image: image ? image : null,
      //   productInfo: created ? created : null,
      // });

      return;

    } catch(err) {
      console.error(err);
      throw err;
    }
  }

  async getCurationInfo(page: number): Promise<CurationInfo[]> {

    page = (page - 1) * 10;

    let curationInfo: Curation[] = await this.curationRepository.createQueryBuilder('curation')
      .leftJoinAndSelect('curation.productInfo', 'productInfo')
      .skip(page)
      .take(10)
      .orderBy('curation.curationId', 'ASC')
      .getMany();

    curationInfo = curationInfo.map((curation) => {
      curation.count = curation.productInfo.length;
      return curation;
    });
    return curationInfo;
  }

  async curationCount():Promise<number> {
    const count: number = await this.curationRepository.createQueryBuilder('curation')
      .select("DISTINCT(`curationId`)").getCount();
    return count;
  }

  async getCurations(): Promise<any> {
    const curationData = await this.curationRepo.getCurations();

    return curationData.reduce((pre, cur) => {
      let target = !['new', 'coming', 'hot'].includes(cur.curation_curationName) ? pre.special[cur.curation_curationName] : pre[cur.curation_curationName];
      if (!target) {
        pre.special[cur.curation_curationName] = [];
        target = pre.special[cur.curation_curationName];
      }

      target.push(
        {
          curationImage: cur.curation_image,
          productTitle: cur.product_title,
          productImage: cur.product_poster,
          productId: cur.product_productId,
          productCompany: cur.product_company,
          productYear: cur.product_year,
          productCate: cur.product_category,
          productBrokerageConsignment: cur.product_brokerageConsignment.split(',')
        }
      )
      return pre;
    }, {
      new: [], coming: [], hot: [], special: {}
    });
  }

}
