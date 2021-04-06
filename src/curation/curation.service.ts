import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurationInfo } from './entity/CurationInfo.entity';
import { Repository } from 'typeorm';
import { CreateCurationDto } from './dto/createCuration.dto';
import { ProviderProductInfo } from '../product/entity/ProductInfo.entity';
import { Curation } from './interface/curation.interface';
import { CurationRepository } from './curation.repository';
import { ProductRepository } from '../product/product.repository';
import { ProviderProduct } from '../product/product.service';

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

  async createCuration(
    createCurationDto: CreateCurationDto,
    curationName: string,
  ) {
    const {
      uniqueId,
      kinds,
      order,
      expose,
      image,
      productTitle,
    } = createCurationDto;
    try {
      const created = await Promise.all(
        productTitle.map((title) => {
          const data = this.providerProductRepository.findOne({
            where: { title },
          });
          return data;
        }),
      );

      if (created.includes(undefined)) {
        throw new BadRequestException('NO_EXIST_PRODUCT');
      }
      console.log(created);

      // 기존작품 똑같은 curation에 등록할 필요가 있는지 확인이 필요
      // created에 있는 curations에 있는 배열돌면서 에러처리하면 될듯

      const data = await Promise.all(
        created.map((prod) => {
          console.log(prod);
          return this.curationRepository.save({
            curationName,
            uniqueId,
            kinds,
            expose,
            order,
            image: image ? image : null,
            productInfo: [prod],
          });
        }),
      );

      return;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getCurationInfo(page: number): Promise<CurationInfo[]> {
    page = (page - 1) * 10;

    let curationInfo: Curation[] = await this.curationRepository
      .createQueryBuilder('curation')
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

  async curationCount(): Promise<number> {
    const count: number = await this.curationRepository
      .createQueryBuilder('curation')
      .select('DISTINCT(`curationId`)')
      .getCount();
    return count;
  }

  async getCurations(): Promise<any> {
    const curationData = await this.curationRepo.getCurations();
    console.log('curationData', curationData);
    return curationData.reduce(
      (pre, cur) => {
        let target = !['new', 'coming', 'hot'].includes(
          cur.curation_curationName,
        )
          ? pre.special[cur.curation_curationName]
          : pre[cur.curation_curationName];
        if (!target) {
          pre.special[cur.curation_curationName] = [];
          target = pre.special[cur.curation_curationName];
        }

        target.push({
          curationImage: cur.curation_image,
          productTitle: cur.product_title,
          productImage: cur.product_posterURL,
          productId: cur.product_productId,
          productCompany: cur.product_company,
          productYear: cur.product_year,
          productCate: cur.product_category,
          productBrokerageConsignment: cur.product_brokerageConsignment.split(
            ',',
          ),
        });
        return pre;
      },
      {
        new: [],
        coming: [],
        hot: [],
        special: {},
      },
    );
  }

  // 배열 / 객체 변환
  convertProductInfo(data: any, skip = true) {
    return data.map((cur) => {
      if (skip) {
        const {
          curationId,
          curationName,
          uniqueId,
          kinds,
          expose,
          order,
          image,
          ...result
        } = cur;
        result.productInfo[0].brokerageConsignments = result.productInfo[0].brokerageConsignment.split(
          ',',
        );
        result.productInfo[0].brokerageConsignments = result.productInfo[0].brokerageConsignments.map(
          (cate) => {
            return cate.replace('목적', '');
          },
        );
        const { brokerageConsignment, ...results } = result.productInfo[0];
        return results;
      } else {
        cur.brokerageConsignments = cur.brokerageConsignment.split(',');
        cur.brokerageConsignments = cur.brokerageConsignments.map((cate) => {
          return cate.replace('목적', '');
        });
        const { brokerageConsignment, ...results } = cur;
        return results;
      }
    });
  }

  async filterCurationInfo(title: string, page: number): Promise<any> {
    page = (page - 1) * 10;
    if (title === '모든작품' || title === '') {
      console.log('here', title);
      const [convertedData, count] = await this.productRepo.totalProduct(page);
      const result = this.convertProductInfo(convertedData, false);
      console.log(123123, result.length);
      return { result, count };
    }
    console.log('here2', title);
    const [convertedData, count] = await this.curationRepo.filterCurations(
      title,
      page,
    );
    const result = this.convertProductInfo(convertedData);
    return { result, count };
  }
}
