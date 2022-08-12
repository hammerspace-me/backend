import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { BackpackEntity } from './backpack.entity';

@Entity()
export class BackpackItemEntity {
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
