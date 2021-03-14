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

  async getBuyerInquiryDetails(userId: number) {
    console.log(userId, '------');
    const buyerInfo =  await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.buyerProductInfo', 'buyerInfo')
      .where('user.userId = :userId', { userId })
      .select([
        'buyerInfo.productId as buyerInfoProductId',
      ])
      .execute();

    const buyerInfoEdu =  await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.buyerProductInfoEdu', 'buyerInfoEdu')
      .where('user.userId = :userId', { userId })
      .select([
        'buyerInfoEdu.productId as buyerInfoEduProductId',
      ])
      .execute();
    console.log(buyerInfoEdu, 'here');
    return buyerInfo.concat(buyerInfoEdu)
  }



}
