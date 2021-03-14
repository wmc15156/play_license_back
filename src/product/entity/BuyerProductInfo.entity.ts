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
import { ProviderProductInfo } from './ProductInfo.entity';

export enum BuyerProgressEnum {
  REVIEW_ADMIN = '관리자 검토중',
  SUPPLEMENTAL_REQUEST = '보완요청',
  REVIEW_PROVIDER = '제작사 검토중',
  COMPLETED = '승인완료',
  CANCELED = '철회완료',
}

@Entity()
export class BuyerProductInfo {
  @PrimaryGeneratedColumn('increment')
  productId: number;

  @Column()
  groupName: string;

  @Column({ type: 'text' })
  introduction: string;

  @Column({ type: 'json'})
  planDocument: object;

  @Column()
  plan: string;

  @Column()
  round: string;

  @Column({ type: 'json' })
  place: object;

  @Column({ type: 'json' })
  price: object;

  @Column()
  isChangedScenario: string;

  @Column()
  changedRange: string;

  @Column()
  requiredMaterials: string;

  @Column()
  selectedMaterials: string;

  @Column({ type: 'json' })
  participant: object;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ type: 'text' })
  comment: string;

  @Column()
  progress: BuyerProgressEnum;

  @Column({ default: '공연목적' })
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
