import { Entity, OneToMany, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BackpackItemEntity } from './backpackItem.entity';

@Entity()
export class BackpackEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  owner: string;

  @OneToMany(
    (type) => BackpackItemEntity,
    (backpackItem) => backpackItem.backpack,
    { cascade: ['insert', 'update'] },
  )
  backpackItems: BackpackItemEntity[];
}
