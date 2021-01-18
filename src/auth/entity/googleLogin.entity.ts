import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LoginInfo } from './loginInfo.entity';

@Entity()
export class GoogleLogin {
  @PrimaryGeneratedColumn('increment')
  googleLoginId: number;

  @Column('text')
  oauthId: string;

  @Column('text', { nullable: true })
  accessToken: string;

  @Column('text', {
    nullable: true,
  })
  refreshToken: string;

  @OneToOne((type) => LoginInfo)
  @JoinColumn()
  loginInfo: LoginInfo;
}
