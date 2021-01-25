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

  @Column()
  planDocument: string;

  //
  @Column({ type: 'json' })
  roundAndPlan: object;

  @Column()
  spot: string;

  @Column()
  priceOption: string;

  @Column()
  changeScenario: string;

  @Column()
  requiredMaterials: string;

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

  @CreateDateColumn()
  createdAt: Date | string;

  @UpdateDateColumn()
  updatedAt: Date | string;

  @DeleteDateColumn()
  deletedAt: Date | string;

  @ManyToOne((type) => User, (user) => user.buyerProductInfo)
  user: User;
}
