import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

import { generateToken } from '../utils/crypto';

@Entity()
export default class BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @PrimaryColumn()
  code: string;

  @Column()
  expiresAt: Date;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date();
  }

  @BeforeInsert()
  async beforeInsert() {
    this.id = await generateToken(16);
    this.createdAt = new Date();
  }
}
