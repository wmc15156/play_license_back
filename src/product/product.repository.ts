import {
  EntityRepository,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  Not,
  Repository,
} from 'typeorm';
import { ProgressEnum, ProviderProductInfo } from './entity/ProductInfo.entity';
import { BadRequestException } from '@nestjs/common';
import { UpdateRequirementsDto } from './dto/updateRequirements.dto';
import { UpdateSelectsDto } from './dto/updateSelects.dto';
import { CreateProductDto } from './dto/createProduct.dto';

export class CountProduct extends ProviderProductInfo {
  count?: number;
}

type Views = {
  views: string;
};

type Count = {
  count: string;
};

type SummaryProductInfo = {
  title: string;
  productId: number;
  createdAt: string;
  progress: ProgressEnum;
};

@EntityRepository(ProviderProductInfo)
export class ProductRepository extends Repository<ProviderProductInfo> {
  async findProduct(product: string[]) {
    const products = await Promise.all(
      product.map((title) => {
        const find = this.findOne({
          where: {
            title,
          },
        });
        return find;
      }),
    );
    return products;
  }

  async getProduct(id: number): Promise<ProviderProductInfo> {
    const product = await this.findOne(id);
    if (!product) {
      throw new BadRequestException('no exist product');
    }
    product.views += 1;
    const result = await this.save(product);
    return result;
  }

  async totalProduct(page: number) {
    return await this.findAndCount({
      take: 10,
      skip: page,
    });
  }

  async filteredProducts(data: string): Promise<ProviderProductInfo[]> {
    let bufferData: CountProduct[] | null = null;
    switch (data) {
      case 'register':
        bufferData = await this.createQueryBuilder('product')
          .orderBy('product.year')
          .getMany();
        break;
      case 'latest':
        bufferData = await this.createQueryBuilder('product')
          .orderBy('product.createdAt')
          .getMany();
        break;

      case 'inquiry':
        bufferData = await this.createQueryBuilder('product')
          .leftJoinAndSelect('product.buyerProducts', 'buyerProducts')
          .leftJoinAndSelect('product.buyerProductForEducation', 'education')
          .getMany();
        bufferData.map((product) => {
          product.count = product.buyerProducts.length;
          product.count += product.buyerProductForEducation.length;
          return product;
        });
        bufferData.sort((p, n) => {
          return n.count - p.count;
        });
    }

    return bufferData;
  }

  async filterData(
    totalNumber: number,
    expression: string[] | null,
    category: string,
    genre: string,
    mainAudience: string,
    sizeOfPerformance: string,
  ) {
    return this.find({
      where: [
        {
          castMembers_total: !isNaN(totalNumber)
            ? expression
              ? LessThan(totalNumber)
              : Not(LessThan(totalNumber))
            : MoreThan(0),
        },
        { category },
        { genre },
        { mainAudience },
        { sizeOfPerformance },
      ], // >=
    });
  }
  // count views
  async getProvider(providerId: number): Promise<Views[]> {
    const data = await this.createQueryBuilder('product')
      .leftJoinAndSelect('product.provider', 'provider')
      .where('provider.providerId = :providerId', { providerId })
      .select('SUM(product.views) as views')
      .execute();
    return data;
  }

  // count like
  async countLike(providerId: number): Promise<Count[]> {
    const data = await this.createQueryBuilder('product')
      .leftJoinAndSelect('product.provider', 'provider')
      .leftJoinAndSelect('product.users', 'users')
      .select('COUNT(users.userId) as count')
      .execute();

    return data;
  }

  async getProductInfoByProvider(providerId): Promise<SummaryProductInfo[]> {
    const data = await this.createQueryBuilder('product')
      .leftJoinAndSelect('product.provider', 'provider')
      .where('provider.providerId = :providerId', { providerId })
      .select(
        'product.title, product.productId, product.createdAt, product.progress',
      )
      .execute();
    return data;
  }

  async getProviderSoldInfo(providerId) {
    const data = await this.createQueryBuilder('product')
      .leftJoinAndSelect('product.provider', 'provider')
      .where('provider.providerId = :providerId', { providerId })
      .andWhere('product.progress = :progress', {
        progress: ProgressEnum.COMPLETED,
      })
      .select(
        'product.title, product.posterURL, product.year, product.company, product.category, product.brokerageConsignment',
      )
      .execute();
    return data;
  }

  // 필수제공 자료 업데이트
  async modifyMaterials(updateData: UpdateRequirementsDto, productId: number) {
    const data = await this.findOne(productId);
    if (!data) {
      throw new BadRequestException('NO EXIST PRODUCT');
    }
    const { requiredMaterials } = updateData;
    data.requiredMaterials = requiredMaterials;
    return await this.save(data);
  }

  // 선택제공 자료 업데이트
  async modifySelectMaterial(updateData: UpdateSelectsDto, productId: number) {
    const data = await this.findOne(productId);
    if (!data) {
      throw new BadRequestException('NO EXIST PRODUCT');
    }
    const { selectMaterials } = updateData;
    data.selectMaterials = selectMaterials;
    return await this.save(data);
  }

  // update Product Data
  async modifyProductData(createProductDto: CreateProductDto, id: number) {
    const product = await this.findOne(id);
    if (!product) {
      throw new BadRequestException('NO EXIST PRODUCT');
    }
    return this.save({
      ...product,
      ...createProductDto,
      brokerageConsignment: createProductDto.brokerageConsignments.join(','),
      genre: JSON.stringify(createProductDto.genre),
      mainAudience: JSON.stringify(createProductDto.mainAudience),
      numberList: JSON.stringify(createProductDto.numberList),
      updatedAt: new Date(),
    });
  }
}
