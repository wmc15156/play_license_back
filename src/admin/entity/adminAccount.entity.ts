import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import * as bcrypt from 'bcryptjs';
@Entity()
export class AdminAccountEntity {
  @PrimaryGeneratedColumn('increment')
  adminId: number;

  @Column({
    nullable: false,
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
  })
  fullName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  async ValidatePassword(password: string) {
    const hash = await bcrypt.hash(password,12);
    return hash === this.password;
  }
}


