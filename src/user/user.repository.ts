import { EntityRepository, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BuyerProgressEnum } from '../product/entity/BuyerProductInfo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BuyerProductInfoRepository } from '../product/buyerProductInfo.repository';

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
     return this.createQueryBuilder('user')
       .where('user.userId = :id', { id })
       .addSelect('user.password')
       .getOne()
  }

  async getBuyerInquiryDetails(userId: number) {
     console.log("here2222");
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
    return buyerInfo.concat(buyerInfoEdu)
  }
  // 공연목적용
  async getInquiryForPerformance(userId: number, productId: number):Promise<User[]> {
     const data =  await this.createQueryBuilder('user')
       .leftJoinAndSelect('user.buyerProductInfo', 'product')
       .where('user.userId = :userId', { userId })
       .andWhere('product.productId = :productId', { productId })
       .execute()
      return data
  }

  async getInquiryForEducation(userId: number, productId: number):Promise<User[]> {
    const data =  await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.buyerProductInfoEdu', 'product')
      .where('user.userId = :userId', { userId })
      .andWhere('product.productId = :productId', { productId })
      .execute()
    return data
  }


  async withdrawAnInquiryForPerformance(userId: number, id: number) {
    let productId = 0;
    let data:any = await this.findOne({
      where: {
        userId
      },
      relations: ['buyerProductInfo'],
    });

    data.buyerProductInfo = data.buyerProductInfo.map((ele) => {
      if(ele.productId === id) {
        productId = ele.productId;
      }
    });
    return productId;
  }

  async withdrawAnInquiryForEducation(userId: number, id: number) {
    let productId = 0;
    let data:any = await this.findOne({
      where: {
        userId
      },
      relations: ['buyerProductInfoEdu'],
    });

    data.buyerProductInfoEdu = data.buyerProductInfoEdu.map((ele) => {
      if(ele.productId === id) {
        productId = ele.productId;
      }
    });
    return productId;
  }


}
