import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany, OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LoginInfo } from '../../auth/entity/loginInfo.entity';
import { Role } from '../../roles/entity/role.entity';
import { ProviderProductInfo } from '../../product/entity/ProductInfo.entity';
import { BuyerProductInfo } from '../../product/entity/BuyerProductInfo.entity';
import {BuyerProductInfoForEdu} from "../../product/entity/BuyerProductInfoForEdu.entity";
import { Question } from '../../question/entity/question.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  userId: number;

  @Column({
    nullable: true,
    unique: true,
  })
  email: string;

  @Column({
    nullable: true,
    select: false,
  })
  password: string;

  @Column({
    nullable: false,
    default: '',
  })
  fullName: string;

  @Column({
    nullable: false,
  })
  phone: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany((type) => LoginInfo, (loginInfo) => loginInfo.user)
  loginInfos: LoginInfo[];

  @ManyToOne((type) => Role, (role) => role.users)
  role: Role;

  @ManyToMany((type) => ProviderProductInfo, (product) => product.users)
  products: ProviderProductInfo[];

  @OneToMany((type) => BuyerProductInfo, (product) => product.user)
  buyerProductInfo: BuyerProductInfo[];

  @OneToMany((type) => BuyerProductInfoForEdu, (product) => product.user)
  buyerProductInfoEdu: BuyerProductInfoForEdu[];

  @OneToMany((type) => Question, (question) => question.user)
  questions: Question[];
}
