import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProviderProductInfo } from '../../product/entity/ProductInfo.entity';
import { Question } from '../../question/entity/question.entity';

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
    nullable: false,
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

  @Column({
    nullable: true,
  })
  avatar: string;

  @Column({
    nullable: true,
  })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany((type) => ProviderProductInfo, (product) => product.provider)
  products: ProviderProductInfo[];

  @OneToMany((type) => Question, (question) => question.provider)
  questions: Question[];
}
