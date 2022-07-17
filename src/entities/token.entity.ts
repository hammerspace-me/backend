import { Entity, Column, PrimaryColumn, BeforeInsert, Index } from 'typeorm';

import { generateToken } from '../utils/crypto';

import BaseEntity from './base.entity';

@Entity()
@Index(['code'], { unique: true })
export default class TokenEntity extends BaseEntity {
  // Expiration time in minutes
  protected expirationTime = 24 * 60; // 24 hours
  protected codeCharacters?: string;
  protected codeLength = 32;

  @PrimaryColumn()
  code: string;

  @Column()
  expiresAt: Date;

  @BeforeInsert()
  setExpiration() {
    this.expiresAt = new Date(
      new Date().getTime() + this.expirationTime * 60 * 1000,
    );
  }

  @BeforeInsert()
  async setCode() {
    this.code = await generateToken(this.codeLength, this.codeCharacters);
  }
}
