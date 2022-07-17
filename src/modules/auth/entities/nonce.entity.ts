import { Entity, JoinColumn, OneToOne } from 'typeorm';

import TokenEntity from '@/entities/token.entity';
import BackpackEntity from '@/modules/backpack/entities/backpack.entity';

@Entity()
export default class NonceEntity extends TokenEntity {
  @OneToOne(() => BackpackEntity)
  @JoinColumn()
  userId: string;
}
