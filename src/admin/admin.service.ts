import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminRepository } from './admin.repository';
import { CreateAdminDto } from './dto/createAdmin';
import { sign } from 'jsonwebtoken';
import { DotenvService } from '../dotenv/dotenv.service';
import { CreateBannerDto } from './dto/createBannerDto';
import { HomeBannerRepository } from './repository/bannerLists.repository';
import { ChangeOrderBannerDto } from './dto/changeOrderBanner.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly dotEnvConfigService: DotenvService,

    @InjectRepository(AdminRepository)
    private readonly adminRepository: AdminRepository,
    @InjectRepository(HomeBannerRepository)
    private readonly homeBannerRepository: HomeBannerRepository,
  ) {}

  async signup(createAdminDto: CreateAdminDto) {
    const data = await this.adminRepository.signup(createAdminDto);
    const { password, createdAt, deletedAt, updatedAt, ...result } = data;
    return result;
  }

  async createAdminToken(adminId: number, provider = 'LOCAL', role = 'admin') {
    const payload = { adminId, provider, role };
    const jwt: string = sign(
      payload,
      this.dotEnvConfigService.get('JWT_SECRET_KEY'),
      {
        expiresIn: '1d',
      },
    );
    return jwt;
  }

  async createAdminBanner(createBannerDto: CreateBannerDto) {
    return this.homeBannerRepository.createAdminBanner(createBannerDto);
  }

  async getBannerList() {
    const data = await this.homeBannerRepository.getBannerList();
    if (!data) return [];
    return data;
  }

  async deleteBanner(id: number) {
    const result =  await this.homeBannerRepository.deleteBanner(id);
    if(result.affected) {
      return true
    } else {
      throw new BadRequestException('NO EXIST_BANNER');
    }
  }

  async changeBannerOrder(bannerDto:ChangeOrderBannerDto) {
    return this.homeBannerRepository.changeBannerOrder(bannerDto);
  }

  async updateBanner(id: number, bannerDto: CreateBannerDto) {
    return this.homeBannerRepository.updateBanner(id, bannerDto);
  }
}
