import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { CastMembers, CreativeStaff } from '../dto/createProduct.dto';
import { CurationInfo } from '../../curation/entity/CurationInfo.entity';
import { Question } from '../../question/entity/question.entity';
import { BuyerProductInfo } from './BuyerProductInfo.entity';
import { BuyerProductInfoForEdu } from './BuyerProductInfoForEdu.entity';
import { ProviderAccount } from '../../auth/entity/providerAccount.entity';

export enum ProgressEnum {
  INPROGRESS = '관리자검토중',
  NEED_SUPPLEMENT = '보완요청',
  COMPLETED = '승인완료',
  DELETED = '철회완료',
}

@Entity()
export class ProviderProductInfo {
  @PrimaryGeneratedColumn('increment')
  productId: number;

  @Column()
  company: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  title: string;

  // 중개위탁
  @Column()
  brokerageConsignment: string;

  //필수제공자료
  @Column({ type: 'json' })
  requiredMaterials: object;

  @Column({ type: 'json' })
  selectMaterials: object;

  @Column({ type: 'text' })
  comment: string;

  @Column()
  category: string;

  @Column({ type: 'json' })
  creativeStaff: object;

  @Column()
  genre: string;

  @Column()
  mainAudience: string;

  @Column()
  sizeOfPerformance: string;

  @Column({ type: 'json' })
  castMembers: object;

  //긱색허용 여부
  @Column()
  changeScenario: string;

  @Column()
  performanceVideo: string;

  // 기획의도
  @Column({ type: 'text' })
  plan: string;

  // 시놉시스: 영화나 드라마 등에서 제작에 앞서 작품의 의도와 줄거리를 서술하는 글. 쉽게 말해 영화 포스터나 티저 영상에 있는 소개글이다.
  @Column({ type: 'text' })
  synopsis: string;

  //공연포스터
  @Column({ type: 'json' })
  posterURL: object;

  //배경이미지 PC
  @Column({
    default: null,
  })
  pcBackground: string;

  @Column({
    default: null,
  })
  mobileBackground: string;

  @Column()
  performanceInformationURL: string;

  @Column()
  numberList: string;

  // 안내사항 체크여부
  @Column({ type: 'boolean' })
  isCheckInformation: boolean;

  @Column()
  year: string;

  @Column()
  progress: ProgressEnum;

  @Column({ default: 0 })
  views: number;

  @Column()
  castMembers_total: number;

  @Column({ type: 'json' })
  totalTime: object;

  @CreateDateColumn()
  createdAt: Date | string;

  @UpdateDateColumn()
  updatedAt: Date | string;

  @DeleteDateColumn()
  deletedAt: Date | string;

  @ManyToMany((type) => User, (user) => user.products, {
    cascade: true,
  })
  @JoinTable({ name: 'user_product_cart' })
  users: User[];

  @ManyToOne((type) => ProviderAccount, (provider) => provider.products)
  provider: ProviderAccount;

  @ManyToMany((type) => CurationInfo, (curation) => curation.productInfo)
  @JoinTable({ name: 'curation_product' })
  curations: CurationInfo;

  @OneToMany((type) => Question, (question) => question.product)
  questions: Question[];

  @OneToMany((type) => BuyerProductInfo, (buyerProduct) => buyerProduct.product)
  buyerProducts: BuyerProductInfo[];

  @OneToMany(
    (type) => BuyerProductInfoForEdu,
    (buyerProductForEdu) => buyerProductForEdu.product,
  )
  buyerProductForEducation: BuyerProductInfoForEdu[];
}
