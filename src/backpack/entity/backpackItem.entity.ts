import { Exclude, Expose } from 'class-transformer';
import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { BackpackEntity } from './backpack.entity';

@Entity()
export class BackpackItemEntity {
  @PrimaryColumn()
  content: string;

  @Column()
  source: string;

  @Column()
  category: string;

  @ManyToOne(
    (type) => BackpackEntity,
    (backpack: BackpackEntity) => backpack.backpackItems,
    {
      primary: true,
      cascade: ['insert', 'update'],
    },
  )
  @Exclude()
  backpack: BackpackEntity;
}
