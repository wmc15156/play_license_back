import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEnum } from '../typed/role.enum';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('increment')
  roleId: number;

  @Column({
    type: 'enum',
    enum: RoleEnum,
  })
  role: RoleEnum;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  // @OneToMany(() => Post, (post) => post.user, { onDelete: 'CASCADE' })
  // @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @OneToMany((type) => User, (user) => user.role)
  users: User[];
}
