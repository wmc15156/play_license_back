import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @OneToOne((type) => User)
  @JoinColumn()
  user;
}
