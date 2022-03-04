import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { BackpackItemEntity } from './backpackItem.entity';

@Entity()
export class BackpackEntity {
  @PrimaryColumn()
  id: string;

  @OneToMany(
    (type) => BackpackItemEntity,
    (backpackItem) => backpackItem.backpack,
    { cascade: ['insert', 'update'] },
  )
  backpackItems: BackpackItemEntity[];
}
