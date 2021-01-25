import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

interface CreateType {
  create?: string;
  delete?: string;
  update?: string;
}

@Entity()
export class JsonTestEntity {
  @PrimaryGeneratedColumn('increment')
  jsonId: number;

  @Column({ type: 'json' })
  json: CreateType;
}
