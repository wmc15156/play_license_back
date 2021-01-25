import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JsonTestEntity } from './entity/jsonTest.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';

import { ProviderProductInfo, ProgressEnum } from './entity/ProductInfo.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { User } from '../user/entity/user.entity';
import { LoginInfo } from '../auth/entity/loginInfo.entity';
import { Product } from './product.controller';
import { CreateProductByBuyerDto } from './dto/createProductByBuyer.dto';
import {
  BuyerProductInfo,
  BuyerProgressEnum,
} from './entity/BuyerProductInfo.entity';

export class BuyerProduct extends BuyerProductInfo {
  place?: Array<string>;
  price?: Array<string>;
  requiredMaterial?: Array<string>;
  changeScenarioAndRange?: Array<string>;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProviderProductInfo)
    private readonly productRepository: Repository<ProviderProductInfo>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BuyerProductInfo)
    private readonly buyerProductRepository: Repository<BuyerProductInfo>,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<ProviderProductInfo> {
    // findUser;
    const { email, userId } = user;
    try {
      const findUser = await this.userRepository.findOne({
        where: { email },
      });

      if (!findUser) {
        throw new BadRequestException('NO_USER');
      }
      const created = await this.productRepository.save({
        title: createProductDto.title,
        company: createProductDto.company,
        name: createProductDto.name,
        phone: createProductDto.phone,
        brokerageConsignment: createProductDto.brokerageConsignment,
        requiredMaterial: createProductDto.requiredMaterials.join(' '),
        selectMaterial: createProductDto.selectMaterials.join(' '),
        comment: createProductDto.comment,
        creativeStaff: createProductDto.creativeStaff,
        genre: createProductDto.genre,
        mainAudience: createProductDto.mainAudience,
        audienceRating: createProductDto.mainAudience,
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

  async convertProductData(product: Product): Promise<any> {
    product.requiredMaterials = product.requiredMaterial.split(' ');
    product.selectMaterials = product.selectMaterial.split(' ');
    console.log('product', product);
    const {
      updatedAt,
      deletedAt,
      selectMaterial,
      requiredMaterial,
      isCheckInformation,
      ...result
    } = product;
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
            selectMaterial,
            requiredMaterial,
            isCheckInformation,
            ...result
          } = product;
          result.createdAt = moment(product.createdAt).format('YYYY-MM-DD');
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

      const buyerProduct = await this.buyerProductRepository.save({
        groupName: createProductByUserDto.groupName,
        introduction: createProductByUserDto.introduction,
        planDocument: createProductByUserDto.planDocument,
        roundAndPlan: createProductByUserDto.roundAndPlan,
        spot:
          Array.isArray(createProductByUserDto.place) &&
          createProductByUserDto.place.join(' '),
        priceOption:
          Array.isArray(createProductByUserDto.price) &&
          createProductByUserDto.price.join(' '),
        changeScenario:
          Array.isArray(createProductByUserDto.changeScenarioAndRange) &&
          createProductByUserDto.changeScenarioAndRange.join(' '),
        requiredMaterials:
          Array.isArray(createProductByUserDto.requiredMaterial) &&
          createProductByUserDto.requiredMaterial.join(' '),
        participant: createProductByUserDto.participant,
        name: createProductByUserDto.name,
        phone: createProductByUserDto.phone,
        comment: createProductByUserDto.comment,
        progress: BuyerProgressEnum.REVIEW_ADMIN,
        user: findUser,
      });

      console.log(buyerProduct);

      return buyerProduct;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async convertBuyerProductData(buyerProduct: BuyerProduct): Promise<any> {
    const { updatedAt, deletedAt, user, ...result } = buyerProduct;
    result.place = result.spot.split(' ');
    result.price = result.priceOption.split(' ');
    result.requiredMaterial = result.requiredMaterials.split(' ');
    result.changeScenarioAndRange = result.changeScenario.split(' ');
    result.createdAt = moment(result.createdAt).format('YYYY-MM-DD');
    const {
      priceOption,
      changeScenario,
      spot,
      requiredMaterials,
      ...resultData
    } = result;
    return resultData;
  }
}
