import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProviderProductInfo } from '../../product/entity/ProductInfo.entity';

@Entity()
export class ProviderAccount {
  @PrimaryGeneratedColumn('increment')
  providerId: number;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
    select: false,
  })
  password: string;

  @Column({
    nullable: false
  })
  phone: string;

  @Column({
    nullable: false,
  })
  fullName: string;

  @Column({
    nullable: true,
  })
  company: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany((type) => ProviderProductInfo, (product) => product.provider)
  products: ProviderProductInfo[]
}
