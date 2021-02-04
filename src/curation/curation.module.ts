import { Module } from '@nestjs/common';
import { CurationController } from './curation.controller';
import { CurationService } from './curation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurationInfo } from './entity/CurationInfo.entity';
import { ProviderProductInfo } from '../product/entity/ProductInfo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CurationInfo,
      ProviderProductInfo,
    ])
  ],
  controllers: [CurationController],
  providers: [CurationService],
  exports: [CurationService],
})
export class CurationModule {}
