import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity({
  name: 'questions'
})
export class Question {
  @PrimaryGeneratedColumn()
  questionId: number;

  @Column({
    length: 20,
  })
  name: string;

  @Column({
    length: 30,
  })
  email: string;

  @Column({
    length: 15,
  })
  phone: string;

  @Column({
    length: 30,
  })
  title: string;

  @Column({
    type: 'text',
  })
  comment: string;

  @Column({
    type: 'boolean'
  })
  isChecked: boolean;

  @CreateDateColumn()
  createdAt: Date | string

  @UpdateDateColumn()
  updatedAt: Date | string

  @DeleteDateColumn()
  deletedAt: Date | string

  @ManyToOne((type) => User, (user) => user.questions)
  user: User;
}
