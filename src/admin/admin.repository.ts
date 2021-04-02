import { EntityRepository, Repository } from 'typeorm';
import { CreateAdminDto } from './dto/createAdmin';
import { AdminAccountEntity } from './entity/adminAccount.entity';
import * as bcrypt from 'bcryptjs';

@EntityRepository(AdminAccountEntity)
export class AdminRepository extends Repository<AdminAccountEntity> {
  async signup(createAdminDto: CreateAdminDto) {
    const hashPassword = await bcrypt.hash(createAdminDto.password, 12);
    return await this.save({
      ...createAdminDto,
      password: hashPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

}
