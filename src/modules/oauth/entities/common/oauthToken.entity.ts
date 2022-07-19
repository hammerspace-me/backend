import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';

import TokenEntity from '~/entities/token.entity';
import { Scopes } from '~/enum/scopes.entity';

import BackpackEntity from '@/backpack/entities/backpack.entity';

@Entity()
export default class OAuthTokenEntity extends TokenEntity {
  @OneToOne(() => BackpackEntity)
  @JoinColumn()
  backpackId: string;

  @Column('simple-array')
  scopes: Scopes;
}
