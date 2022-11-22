import {
  Entity,
  OneToMany,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ItemEntity } from './item.entity';

@Entity()
export class SpaceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  owner: string;

  @OneToMany((type) => ItemEntity, (item) => item.space, {
    cascade: ['insert', 'update'],
  })
  items: ItemEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
