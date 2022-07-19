import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { generateToken } from '../utils/crypto';

@Entity()
export default class BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @BeforeInsert()
  async beforeInsert() {
    this.id = await generateToken(16);
  }
}
