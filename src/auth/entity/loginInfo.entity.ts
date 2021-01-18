import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { GoogleLogin } from './googleLogin.entity';
import { User } from '../../user/entity/user.entity';
import { AuthProviderEnum } from '../enum/authProvider.enum';
import { KakaoLogin } from './kakao.entity';
import { NaverLogin } from './naver.entity';

@Entity()
export class LoginInfo {
  @PrimaryGeneratedColumn('increment')
  loginInfoId: number;

  @Column({
    type: 'enum',
    enum: AuthProviderEnum,
  })
  provider: AuthProviderEnum;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne((type) => GoogleLogin)
  google;

  @OneToOne((type) => KakaoLogin)
  kakao;
  @OneToOne((type) => NaverLogin)
  naver;

  @ManyToOne((type) => User, (user) => user.loginInfos)
  user: User;
}
