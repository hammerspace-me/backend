import BaseEntity from '@/entities/base.entity';
import { Entity, PrimaryColumn, Index } from 'typeorm';

@Entity()
@Index(['address'], { unique: true })
export default class UserEntity extends BaseEntity {
  @PrimaryColumn()
  address: string;
}
