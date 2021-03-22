import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JsonTestEntity } from './entity/jsonTest.entity';
import { ProviderProductInfo } from './entity/ProductInfo.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { User } from '../user/entity/user.entity';
import { BuyerProductInfo } from './entity/BuyerProductInfo.entity';
import { BuyerProductInfoForEdu } from './entity/BuyerProductInfoForEdu.entity';
import { ProductRepository } from './product.repository';
import { UserRepo } from '../user/user.repository';
import { ProviderAccount } from '../auth/entity/providerAccount.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProviderProductInfo,
      User,
      BuyerProductInfo,
      BuyerProductInfoForEdu,
      ProductRepository,
      UserRepo,
      ProviderAccount
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],

})
export class ProductModule {}
