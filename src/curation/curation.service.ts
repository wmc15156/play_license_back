import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurationInfo } from './entity/CurationInfo.entity';
import { Repository } from 'typeorm';
import { CreateCurationDto } from './dto/createCuration.dto';
import { ProviderProductInfo } from '../product/entity/ProductInfo.entity';

export class Curation extends CurationInfo {
  count?: number;
}

@Injectable()
export class CurationService {
  constructor(
    @InjectRepository(CurationInfo)
    private readonly curationRepository: Repository<CurationInfo>,
    @InjectRepository(ProviderProductInfo)
    private readonly providerProductRepository: Repository<ProviderProductInfo>
  ) {}

  async createCuration(createCurationDto: CreateCurationDto) {
    const { curation, uniqueId, kinds, order, expose } = createCurationDto;
    try {
      const findCuration = await this.curationRepository.findOne({
        where: {curation}
      });

      if(findCuration) {
        throw new ConflictException('ALREADY_EXIST_CURATION_NAME');
      }

      await this.curationRepository.save({
        curation,
        uniqueId,
        kinds,
        expose,
        order,
      });

      return;

    } catch(err) {
      console.error(err);
      throw err;
    }
  }
}
