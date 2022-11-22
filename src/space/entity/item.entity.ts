import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { SpaceEntity } from './space.entity';

@Entity()
export class ItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  source: string;

  @Column()
  category: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  public metadata: any;

  @ManyToOne((type) => SpaceEntity, (space: SpaceEntity) => space.items, {
    cascade: ['insert', 'update'],
  })
  @Exclude()
  space: SpaceEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
