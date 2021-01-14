import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
@Entity()
export class PhoneValidation {
  @PrimaryGeneratedColumn('increment')
  phoneValidationId: number;

  @Column()
  phone: string;

  @Column()
  validationCode: string;

  @Column({
    default: false,
  })
  isValid: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
