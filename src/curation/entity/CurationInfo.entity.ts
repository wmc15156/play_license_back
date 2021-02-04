import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProviderProductInfo } from '../../product/entity/ProductInfo.entity';

@Entity()
export class CurationInfo {
    @PrimaryGeneratedColumn('increment')
    curationId: number;

    @Column()
    curationName: string;

    @Column()
    uniqueId: string;

    @Column({ default: '디폴트' })
    kinds: string;

    @Column({ default: '비노출' })
    expose: string;

    @Column()
    order: number;

    @Column({ nullable: true })
    image: string;

    @ManyToMany((type) => ProviderProductInfo, product => product.curations)
    productInfo: ProviderProductInfo[];


}
