import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import * as moment from 'moment';

import { ProviderProductInfo, ProgressEnum } from './entity/ProductInfo.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { User } from '../user/entity/user.entity';
import { CreateProductByBuyerDto } from './dto/createProductByBuyer.dto';
import {
  BuyerProductInfo,
  BuyerProgressEnum,
} from './entity/BuyerProductInfo.entity';
import { CreateProductByUserForEducationalDto } from './dto/createProductByUserForEducational.dto';
import { BuyerProductInfoForEdu } from './entity/BuyerProductInfoForEdu.entity';
import { ProductRepository } from './product.repository';

export class BuyerProduct extends BuyerProductInfo {
  requiredMaterial?: Array<string>;
}

export class ProviderProduct extends ProviderProductInfo {
  brokerageConsignments?: string | string[]
}

export const limit = 20;

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProviderProductInfo)
    private readonly productRepository: Repository<ProviderProductInfo>,
    @InjectRepository(ProductRepository)
    private readonly productRepo: ProductRepository,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BuyerProductInfo)
    private readonly buyerProductRepository: Repository<BuyerProductInfo>,
    @InjectRepository(BuyerProductInfoForEdu)
    private readonly buyerProductInfoForEduRepository: Repository<BuyerProductInfoForEdu>,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<ProviderProductInfo> {
    // findUser;
    const { email, userId } = user;
    const addPriceToVar: object = {};
    try {
      const findUser = await this.userRepository.findOne({
        where: { email },
      });

      if (!findUser) {
        throw new BadRequestException('NO_USER');
      }

      createProductDto.selectMaterials.forEach((item) => {
        addPriceToVar[item] = '0원';
      });

      const created = await this.productRepository.save({
        title: createProductDto.title,
        company: createProductDto.company,
        description: createProductDto.description,
        name: createProductDto.name,
        phone: createProductDto.phone,
        brokerageConsignment: createProductDto.brokerageConsignment.join(','),
        requiredMaterials: createProductDto.requiredMaterials.join(','),
        selectMaterials: addPriceToVar,
        comment: createProductDto.comment,
        creativeStaff: createProductDto.creativeStaff,
        genre: createProductDto.genre,
        mainAudience: createProductDto.mainAudience,
        sizeOfPerformance: createProductDto.sizeOfPerformance,
        castMembers: createProductDto.castMembers,
        changeScenario: createProductDto.changeScenario,
        performanceVideo: createProductDto.performanceVideo,
        plan: createProductDto.planningDocument,
        synopsis: createProductDto.synopsis,
        poster: createProductDto.posterURL,
        pcBackground: createProductDto.pcBackground,
        mobileBackground: createProductDto.mobileBackground,
        performanceInformationURL: createProductDto.performanceInformationURL,
        numberList: createProductDto.numberList,
        isCheckInformation: createProductDto.isCheckInformation,
        category: createProductDto.category,
        year: createProductDto.year,
        progress: ProgressEnum.INPROGRESS,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      return created;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async convertProductData(product): Promise<any> {
    console.log('product', product);
    const { updatedAt, deletedAt, isCheckInformation, ...result } = product;
    console.log(result);
    result.createdAt = moment(product.createdAt).format('YYYY-MM-DD');
    return result;
  }

  async addItem(user: User, id: number): Promise<void> {
    const { userId, email } = user;
    try {
      const user = await this.userRepository.findOne(userId);
      const product = await this.productRepository.findOne(id);

      if (!product) {
        throw new ForbiddenException('not exist product');
      }

      product.users = [user];
      await this.productRepository.save(product);
      return;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getItem(user: User): Promise<any> {
    const { userId } = user;
    try {
      const findUser = await this.userRepository.find({
        where: { userId },
        relations: ['products'],
      });

      if (findUser[0]) {
        return findUser[0].products.map((product, i) => {
          const {
            updatedAt,
            deletedAt,
            isCheckInformation,
            createdAt,
            description,
            phone,
            selectMaterials,
            comment,
            performanceVideo,
            castMembers,
            sizeOfPerformance,
            mainAudience,
            genre,
            creativeStaff,
            ...result
          } = product;
          console.log(result);
          return result;
        });
      } else {
        return [];
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async createProductByUser(
    user: User,
    createProductByUserDto: CreateProductByBuyerDto,
  ) {
    const { userId } = user;
    try {
      const findUser = await this.userRepository.findOne(userId);
      const convertToString = JSON.stringify(createProductByUserDto.planDocument);
      const buyerProduct = await this.buyerProductRepository.save({
        groupName: createProductByUserDto.groupName,
        introduction: createProductByUserDto.introduction,
        planDocument: createProductByUserDto.planDocument,
        round: createProductByUserDto.round,
        place: createProductByUserDto.place,
        plan: JSON.stringify(createProductByUserDto.plan),
        price: createProductByUserDto.price,
        isChangedScenario: createProductByUserDto.isChangedScenario,
        changedRange: JSON.stringify(createProductByUserDto.changedRange),
        requiredMaterials:
          Array.isArray(createProductByUserDto.requiredMaterials) &&
          createProductByUserDto.requiredMaterials.join(','),
        selectedMaterials: JSON.stringify(createProductByUserDto.selectedMaterials),
        participant: createProductByUserDto.participant,
        name: createProductByUserDto.name,
        phone: createProductByUserDto.phone,
        comment: createProductByUserDto.comment,
        progress: BuyerProgressEnum.REVIEW_ADMIN,
        user: findUser,
      });

      return buyerProduct;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async convertBuyerProductData(buyerProduct: any): Promise<any> {
    const { updatedAt, deletedAt, user, ...result } = buyerProduct;
    result.requiredMaterials = result.requiredMaterials.split(',');
    result.createdAt = moment(result.createdAt).format('YYYY-MM-DD');
    return result;
  }

  async createProductByUserForEducational(
    user: User,
    createProductByUserForEducationalDto: CreateProductByUserForEducationalDto,
  ) {
    const { userId } = user;
    try {
      const findUser = await this.userRepository.findOne(userId);
      const created = await this.buyerProductInfoForEduRepository.save({
        groupName: createProductByUserForEducationalDto.groupName,
        introduction: createProductByUserForEducationalDto.introduction,
        objective: createProductByUserForEducationalDto.objective,
        period: createProductByUserForEducationalDto.period,
        startDate: JSON.stringify(createProductByUserForEducationalDto.startDate),
        requiredMaterials:
          Array.isArray(
            createProductByUserForEducationalDto.requiredMaterials,
          ) && createProductByUserForEducationalDto.requiredMaterials.join(','),
        selectedMaterials:
          JSON.stringify(createProductByUserForEducationalDto.selectedMaterials),
        name: createProductByUserForEducationalDto.name,
        phone: createProductByUserForEducationalDto.phone,
        comment: createProductByUserForEducationalDto.comment,
        progress: BuyerProgressEnum.REVIEW_ADMIN,
        category: createProductByUserForEducationalDto.category,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: findUser,
      });

      return created;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async searchProduct(
    query: string,
    page: number,
  ): Promise<ProviderProductInfo[]> {
    const pagination = page - 1;
    if(!query) {
      return [];
    }
    try {
      const findProduct = await this.productRepository
        .createQueryBuilder('product')
        .where('product.title like :title', { title: `%${query}%` })
        .andWhere('product.progress = :progress', {
          progress: ProgressEnum.INPROGRESS,
        })
        .skip(pagination)
        .take(limit)
        .getMany();
      return findProduct;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async test2(data: string) {
    const findProduct = await this.productRepository
      .createQueryBuilder('product2')
      .select('product2')
      .from(ProviderProductInfo, undefined)
      .getMany()
    console.log(findProduct,123)
  }

  async convertProductsData(product: any): Promise<any> {
    const data =  product.map((item) => {
      const { updatedAt, deletedAt, castMembers, changeScenario,...result } = item;
      result.brokerageConsignments = result.brokerageConsignment.split(',');
      result.brokerageConsignments = result.brokerageConsignments.map((cate) => {
        return cate.replace("목적","");
      });
      const {brokerageConsignment, ...results } = result;
      return results;
    });
    return data;
  }

  async getBuyerInquiryDetails(user):Promise<Promise<BuyerProductInfoForEdu>[] | Promise<BuyerProductInfo>[]> {
    const { userId } = user;
    let sumProduct = [];
    try {
      const findUserAndProduct = await this.userRepository.find({
        where: {userId},
        relations: ['buyerProductInfo','buyerProductInfoEdu']
      });

      sumProduct = sumProduct.concat(findUserAndProduct[0].buyerProductInfoEdu)
      sumProduct = sumProduct.concat(findUserAndProduct[0].buyerProductInfo);

      return  sumProduct.map((product) => {
        const { updatedAt, deletedAt, ...result } = product;
        result.createdAt = moment(result.createdAt).format('YYYY-MM-DD');
        result.requiredMaterials = result.requiredMaterials.split(',');
        return result;
      });

    } catch(err) {
      console.error(err);
    }

  }

  async deleteWishProduct(id: number, me:User): Promise<null> {
    const product = await this.productRepository.findOne({
      where: {
        productId: id
      },
      relations: ['users']
    });
    if(!product) {
      throw new ForbiddenException('product is not exist');
    }
    product.users = product.users.filter((user) => {
      return user.userId !== me.userId
    });
    await this.productRepository.save(product);
    return;
  }

  async getProduct(id: number):Promise<any> {
    const product:ProviderProduct = await this.productRepo.getProduct(id);
    const { updatedAt, deletedAt,...result } = product;
    result.brokerageConsignments = result.brokerageConsignment.split(',');
    result.brokerageConsignments = result.brokerageConsignments.map((cate) => {
      return cate.replace("목적","");
    });
    const { brokerageConsignment, ...results } = result;
    return results;
  }

  async filterSelectData(data: string) {
    const allProductData = await this.productRepo.filteredProducts(data);
    console.log(allProductData);
    return allProductData;
  }

}
