import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { BuyerProgressEnum } from './BuyerProductInfo.entity';
import { ProviderProductInfo } from './ProductInfo.entity';

@Entity()
export class BuyerProductInfoForEdu {
  @PrimaryGeneratedColumn('increment')
  productId: number;

  @Column()
  groupName: string;

  @Column({ type: 'text' })
  introduction: string;

  @Column({ type: 'json'})
  objective: object;

  @Column()
  period: string;

  @Column()
  startDate: string;

  @Column()
  requiredMaterials: string;

  @Column()
  comment: string;

  @Column()
  progress: BuyerProgressEnum;

  @Column()
  selectedMaterials: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  category: string;

  @Column( { default: '관리자검토중'})
  admin_check: string;

  @CreateDateColumn()
  createdAt: Date | string;

  @UpdateDateColumn()
  updatedAt: Date | string;

  @DeleteDateColumn()
  deletedAt: Date | string;

  @ManyToOne((type) => User, (user) => user.buyerProductInfo)
  user: User;

  @ManyToOne((type) => ProviderProductInfo, (product) => product.buyerProducts)
  product: ProviderProductInfo;
}
