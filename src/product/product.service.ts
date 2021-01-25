import { BadRequestException, Injectable } from '@nestjs/common';
import { JsonTestEntity } from './entity/jsonTest.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductInfoEntity, ProgressEnum } from './entity/ProductInfo.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { User } from '../user/entity/user.entity';
import { LoginInfo } from '../auth/entity/loginInfo.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductInfoEntity)
    private readonly productRepository: Repository<ProductInfoEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<ProductInfoEntity> {
    // findUser;
    const { email, userId } = user;
    try {
      console.log(email, userId);
      const findUser = await this.userRepository.findOne({
        where: { email },
      });
      console.log(2);
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
        adaptedStatus: createProductDto.adaptedStatus,
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
}
