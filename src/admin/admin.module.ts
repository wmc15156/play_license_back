import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAccountEntity } from './entity/adminAccount.entity';
import { HomeBannerListsEntity } from './entity/homeBannerLists.entity';
import { AdminRepository } from './admin.repository';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { DotenvModule } from '../dotenv/dotenv.module';
import { HomeBannerRepository } from './repository/bannerLists.repository';

@Module({
  imports: [
    DotenvModule,
    TypeOrmModule.forFeature([
      HomeBannerListsEntity,
      AdminRepository,
      AdminAccountEntity,
      HomeBannerRepository
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
