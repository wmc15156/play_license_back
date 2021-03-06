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
import { UserRepo } from '../user/user.repository';
import { BuyerInfo } from './type/typed';

import * as _ from 'lodash';
import { ProviderAccount } from '../auth/entity/providerAccount.entity';
import changeDateFormat from '../utils/chagneDate';
import { convertToArray, removeTextObjective } from '../utils/chageDataType';
import { UpdateRequirementsDto } from './dto/updateRequirements.dto';
import { UpdateSelectsDto } from './dto/updateSelects.dto';

export class BuyerProduct extends BuyerProductInfo {
  requiredMaterial?: Array<string>;
}

export class ProviderProduct extends ProviderProductInfo {
  brokerageConsignments?: string | string[];
  count?: number;
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
    @InjectRepository(UserRepo)
    private readonly userRepo,
    @InjectRepository(ProviderAccount)
    private readonly providerAccountRepository: Repository<ProviderAccount>,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<ProviderProductInfo> {
    // findUser;
    const { email, userId } = user;
    const addPriceToVar: object = {};
    try {
      const findUser = await this.providerAccountRepository.findOne({
        where: { email },
      });

      if (!findUser) {
        throw new BadRequestException('NO_USER');
      }

      // createProductDto.selectMaterials.forEach((item) => {
      //   addPriceToVar[item] = '0???';
      // });
      console.log('213123123', createProductDto);
      const created = await this.productRepository.save({
        title: createProductDto.title,
        company: createProductDto.company,
        description: createProductDto.description,
        name: createProductDto.name,
        phone: createProductDto.phone,
        brokerageConsignment: createProductDto.brokerageConsignments.join(','),
        requiredMaterials: createProductDto.requiredMaterials,
        selectMaterials: createProductDto.selectMaterials,
        comment: createProductDto.comment,
        creativeStaff: createProductDto.creativeStaff,
        genre: JSON.stringify(createProductDto.genre),
        mainAudience: JSON.stringify(createProductDto.mainAudience),
        sizeOfPerformance: createProductDto.sizeOfPerformance,
        castMembers: createProductDto.castMembers,
        changeScenario: createProductDto.changeScenario,
        performanceVideo: createProductDto.performanceVideo,
        plan: createProductDto.planningDocument,
        synopsis: createProductDto.synopsis,
        posterURL: createProductDto.posterURL,
        performanceInformationURL: createProductDto.performanceInformationURL,
        numberList: JSON.stringify(createProductDto.numberList),
        isCheckInformation: createProductDto.isCheckInformation,
        category: createProductDto.category,
        year: createProductDto.year,
        castMembers_total: createProductDto.castMembers_total,
        totalTime: createProductDto.runningTime,
        provider: findUser,
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
    const { updatedAt, deletedAt, isCheckInformation, ...result } = product;
    result.genre = JSON.parse(result.genre);
    result.numberList = JSON.parse(result.numberList);
    result.mainAudience = JSON.parse(result.mainAudience);
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
    const { productId } = createProductByUserDto;
    try {
      const findUser = await this.userRepository.findOne(userId);
      const product = await this.productRepo.findOne(productId);
      if (!product) {
        throw new BadRequestException('no exist productId');
      }

      const buyerProduct = await this.buyerProductRepository.save({
        groupName: createProductByUserDto.groupName,
        introduction: createProductByUserDto.introduction,
        planDocument: createProductByUserDto.planDocument,
        round: createProductByUserDto.round,
        place: createProductByUserDto.place,
        plan: JSON.stringify(createProductByUserDto.plan),
        price: createProductByUserDto.price,
        isChangedScenario: createProductByUserDto.isChangedScenario,
        changedRange: createProductByUserDto.changedRange,
        requiredMaterials:
          Array.isArray(createProductByUserDto.requiredMaterials) &&
          createProductByUserDto.requiredMaterials.join(','),
        selectedMaterials: createProductByUserDto.selectedMaterials,
        participant: createProductByUserDto.participant,
        name: createProductByUserDto.name,
        phone: createProductByUserDto.phone,
        comment: createProductByUserDto.comment,
        progress: BuyerProgressEnum.REVIEW_ADMIN,
        user: findUser,
        product,
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
    result.plan = JSON.parse(result.plan);
    return result;
  }

  async createProductByUserForEducational(
    user: User,
    createProductByUserForEducationalDto: CreateProductByUserForEducationalDto,
  ) {
    const { userId } = user;
    const { productId } = createProductByUserForEducationalDto;
    try {
      const findUser = await this.userRepository.findOne(userId);
      const product = await this.productRepo.findOne(productId);
      if (!product) {
        throw new BadRequestException('no exist productId');
      }
      const created = await this.buyerProductInfoForEduRepository.save({
        groupName: createProductByUserForEducationalDto.groupName,
        introduction: createProductByUserForEducationalDto.introduction,
        objective: createProductByUserForEducationalDto.objective,
        period: createProductByUserForEducationalDto.period,
        plan: JSON.stringify(createProductByUserForEducationalDto.plan),
        requiredMaterials:
          Array.isArray(
            createProductByUserForEducationalDto.requiredMaterials,
          ) && createProductByUserForEducationalDto.requiredMaterials.join(','),
        selectedMaterials:
          createProductByUserForEducationalDto.selectedMaterials,
        name: createProductByUserForEducationalDto.name,
        phone: createProductByUserForEducationalDto.phone,
        comment: createProductByUserForEducationalDto.comment,
        progress: BuyerProgressEnum.REVIEW_ADMIN,
        category: createProductByUserForEducationalDto.category,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: findUser,
        product,
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
    if (!query) {
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
      .getMany();
    console.log(findProduct, 123);
  }

  // category ?????? ?????? ??? ????????? ??????
  async convertProductsData(product: any): Promise<any> {
    const data = product.map((item) => {
      const {
        updatedAt,
        deletedAt,
        castMembers,
        changeScenario,
        ...result
      } = item;
      result.brokerageConsignments = result.brokerageConsignment.split(',');
      result.brokerageConsignments = result.brokerageConsignments.map(
        (cate) => {
          return cate.replace('??????', '');
        },
      );
      const { brokerageConsignment, ...results } = result;
      return results;
    });
    return data;
  }

  async getBuyerInquiryDetails(
    user,
  ): Promise<Promise<BuyerProductInfoForEdu>[] | Promise<BuyerProductInfo>[]> {
    const { userId } = user;
    let sumProduct = [];
    try {
      const findUserAndProduct = await this.userRepository.find({
        where: { userId },
        relations: ['buyerProductInfo', 'buyerProductInfoEdu', 'products'],
      });
      const buyerInfo: BuyerInfo[] = await this.userRepo.getBuyerInquiryDetails(
        userId,
      );

      const data = await Promise.all(
        buyerInfo.map((data) => {
          if (data.buyerInfoProductId) {
            return this.buyerProductRepository
              .createQueryBuilder('buyerInfo')
              .leftJoinAndSelect('buyerInfo.product', 'product')
              .where('buyerInfo.productId = :id', {
                id: data.buyerInfoProductId,
              })
              .select([
                'buyerInfo.productId as questionId',
                'buyerInfo.progress as adminCheck',
                'buyerInfo.createdAt as createdAt',
                'buyerInfo.category as category',
                'product.title as title',
              ])
              .execute();
          }
          if (data.buyerInfoEduProductId) {
            return this.buyerProductInfoForEduRepository
              .createQueryBuilder('buyerInfoEdu')
              .leftJoinAndSelect('buyerInfoEdu.product', 'product')
              .where('buyerInfoEdu.productId = :id', {
                id: data.buyerInfoEduProductId,
              })
              .select([
                'buyerInfoEdu.productId as questionId',
                'buyerInfoEdu.progress as adminCheck',
                'buyerInfoEdu.createdAt as createdAt',
                'buyerInfoEdu.category as category',
                'product.title as title',
              ])
              .execute();
          }
        }),
      );

      const result = _.flatten(data);

      return result.map((product) => {
        console.log(product);
        if (product) {
          console.log(product);
          product.createdAt = moment(product.createdAt).format('YYYY-MM-DD');
          return product;
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async deleteWishProduct(id: number, me: User): Promise<null> {
    const product = await this.productRepository.findOne({
      where: {
        productId: id,
      },
      relations: ['users'],
    });
    if (!product) {
      throw new ForbiddenException('product is not exist');
    }
    product.users = product.users.filter((user) => {
      return user.userId !== me.userId;
    });
    await this.productRepository.save(product);
    return;
  }

  async getProduct(id: number): Promise<any> {
    const product: any = await this.productRepo.getProduct(id);
    const { updatedAt, deletedAt, ...result } = product;
    result.brokerageConsignments = result.brokerageConsignment.split(',');
    result.brokerageConsignment = removeTextObjective(
      result.brokerageConsignment,
    );
    result.brokerageConsignments = result.brokerageConsignments.map((cate) => {
      return cate.replace('??????', '');
    });
    return result;
  }

  async filterSelectData(data: string): Promise<any> {
    const allProductData = await this.productRepo.filteredProducts(data);
    const result = this.filteredProductData(allProductData);
    return result;
  }

  async filteredProductData(productArr: ProviderProductInfo[]) {
    const data = productArr.map((item) => {
      const {
        updatedAt,
        deletedAt,
        castMembers,
        changeScenario,
        ...data
      } = item;
      const result: ProviderProduct = item;
      result.brokerageConsignments = result.brokerageConsignment.split(',');
      result.brokerageConsignments = result.brokerageConsignments.map(
        (cate) => {
          return cate.replace('??????', '');
        },
      );
      const {
        brokerageConsignment,
        count,
        buyerProductForEducation,
        buyerProducts,
        ...results
      } = result;
      return results;
    });
    return data;
  }

  async filterData(
    totalNumber: number,
    expression: string[] | null,
    category: string,
    genre: string,
    mainAudience: string,
    sizeOfPerformance: string,
  ) {
    const product = await this.productRepo.filterData(
      totalNumber,
      expression,
      category,
      genre,
      mainAudience,
      sizeOfPerformance,
    );
    return this.filteredProductData(product);
  }

  async getProviderInfo(user: ProviderAccount) {
    const { providerId } = user;
    const views = await this.productRepo.getProvider(providerId);
    const count = await this.productRepo.countLike(providerId);
    return { views: views[0].views, count: count[0].count, buy: '0' };
  }

  // ???????????? ????????? ?????? ???????????????
  async getProductInfo(user: ProviderAccount) {
    const { providerId } = user;
    const result = await this.productRepo.getProductInfoByProvider(providerId);
    return result.map((elem) => {
      elem.createdAt = changeDateFormat(elem.createdAt);
      return elem;
    });
  }

  // ?????? ?????? ?????? ??????
  async getProviderSoldInfo(user: ProviderAccount) {
    const result = await this.productRepo.getProviderSoldInfo(user.providerId);
    return convertToArray(result);
  }

  // ?????? ?????? ?????? ????????????
  async modifyMaterials(updateData: UpdateRequirementsDto, id: number) {
    return await this.productRepo.modifyMaterials(updateData, id);
  }
  // ?????? ?????? ?????? ??????
  async modifySelectMaterial(updateData: UpdateSelectsDto, id) {
    return this.productRepo.modifySelectMaterial(updateData, id);
  }

  // ?????? ????????? ??????
  async modifyProductData(productData: CreateProductDto, id) {
    return this.productRepo.modifyProductData(productData, id);
  }
}
