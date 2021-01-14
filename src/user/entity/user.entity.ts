import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LoginInfo } from '../../auth/entity/loginInfo.entity';
import { Role } from '../../roles/entity/role.entity';

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
    nullable: false,
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
}
