import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import TokenEntity from '~/entities/token.entity';

import BackpackEntity from '@/backpack/entities/backpack.entity';

@Entity()
export default class NonceEntity extends TokenEntity {
  @OneToOne(() => BackpackEntity)
  @JoinColumn()
  subject?: string; // address or userId

  @Column()
  action: 'register' | 'login';
}
