import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';

import TokenEntity from '@/entities/token.entity';
import BackpackEntity from '@/modules/backpack/entities/backpack.entity';
import { Scopes } from '@/enum/scopes.entity';

@Entity()
export default class OAuthTokenEntity extends TokenEntity {
  @OneToOne(() => BackpackEntity)
  @JoinColumn()
  backpackId: string;

  @Column('simple-array')
  scopes: Scopes;
}
