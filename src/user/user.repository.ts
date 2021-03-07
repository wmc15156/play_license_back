import { EntityRepository, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { BadRequestException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepo extends Repository<User> {
   async findEmail(phone: string) {
    const data = await this.findOne({
      where: {
        phone
      }
    });

    if(!data) {
      throw new  BadRequestException('no exist email');
    }
    return data;
  }

  async findUserForId(id: number) {
     return this.findOne(id);
  }

}
