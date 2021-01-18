import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LoginInfo } from './loginInfo.entity';

@Entity()
export class NaverLogin {
  @PrimaryGeneratedColumn('increment')
  naverLoginId: number;

  @Column('text')
  oauthId: string;

  @Column('text')
  accessToken: string;

  @Column('text', { nullable: true })
  refreshToken: string;

  @OneToOne((type) => LoginInfo)
  @JoinColumn()
  loginInfo: LoginInfo;
}
