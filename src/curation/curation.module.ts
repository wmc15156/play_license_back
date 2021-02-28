import { Module } from '@nestjs/common';
import { CurationController } from './curation.controller';
import { CurationService } from './curation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurationInfo } from './entity/CurationInfo.entity';
import { ProviderProductInfo } from '../product/entity/ProductInfo.entity';
import { CurationRepository } from './curation.repository';
import { ProductRepository } from '../product/product.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CurationInfo,
      ProviderProductInfo,
      CurationRepository,
      ProductRepository,
    ])
  ],
  controllers: [CurationController],
  providers: [CurationService],
  exports: [CurationService],
})
export class CurationModule {}
