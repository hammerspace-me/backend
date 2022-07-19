import { Entity, PrimaryColumn, Index } from 'typeorm';

import BaseEntity from '~/entities/base.entity';

@Entity()
@Index(['address'], { unique: true })
@Index(['email'], { unique: true })
export default class UserEntity extends BaseEntity {
  @PrimaryColumn()
  address: string;

  @PrimaryColumn()
  email: string;
}
