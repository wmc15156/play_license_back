import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProviderProductInfo } from '../../product/entity/ProductInfo.entity';

@Entity()
export class CurationInfo {
    @PrimaryGeneratedColumn('increment')
    curationId: number;

    @Column()
    curation: string;

    @Column()
    uniqueId: string;

    @Column({default: '디폴트'})
    kinds: string;

    @Column({ default: '비노출'})
    expose: string;

    @Column()
    order: number;

    @OneToMany((type) => ProviderProductInfo, product => product.curation)
    productInfo: ProviderProductInfo[];

    // TODO: cruation order 어떨게 효율적으로 저장할지 생각해보기

}
