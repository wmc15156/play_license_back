import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurationInfo } from './entity/CurationInfo.entity';
import { Repository } from 'typeorm';
import { CreateCurationDto } from './dto/createCuration.dto';
import { ProviderProductInfo } from '../product/entity/ProductInfo.entity';



@Injectable()
export class CurationService {
  constructor(
    @InjectRepository(CurationInfo)
    private readonly curationRepository: Repository<CurationInfo>,
    @InjectRepository(ProviderProductInfo)
    private readonly providerProductRepository: Repository<ProviderProductInfo>
  ) {}

  async createCuration(createCurationDto: CreateCurationDto, curationName: string) {
    const { uniqueId, kinds, order, expose, image, productTitle } = createCurationDto;
    try {
      const findCuration = await this.curationRepository.findOne({
        where: { curationName }
      });

      if(findCuration) {
        throw new ConflictException('ALREADY_EXIST_CURATION_NAME');
      }

      const created = await Promise.all(productTitle.map((title) => {
        const data =  this.providerProductRepository.findOne({
          where: { title }
        });
        return data;
      }));

      await this.curationRepository.save({
        curationName,
        uniqueId,
        kinds,
        expose,
        order,
        image: image ? image : null,
        productInfo: created ? created : null,
      });

      return;

    } catch(err) {
      console.error(err);
      throw err;
    }
  }
}
