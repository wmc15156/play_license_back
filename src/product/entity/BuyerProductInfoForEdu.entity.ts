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

@Entity()
export class BuyerProductInfoForEdu {
  @PrimaryGeneratedColumn('increment')
  productId: number;

  @Column()
  groupName: string;

  @Column({ type: 'text' })
  introduction: string;

  @Column()
  objective: string;

  @Column()
  period: string;

  @Column()
  startDate: string;

  @Column()
  requiredMaterials: string;

  @Column({ type: 'json' })
  selectedMaterials: object;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  comment: string;

  @Column()
  progress: BuyerProgressEnum;

  @Column()
  category: string;

  @CreateDateColumn()
  createdAt: Date | string;

  @UpdateDateColumn()
  updatedAt: Date | string;

  @DeleteDateColumn()
  deletedAt: Date | string;

  @ManyToOne((type) => User, (user) => user.buyerProductInfo)
  user: User;
}
