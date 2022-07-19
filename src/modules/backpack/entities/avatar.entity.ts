import { ProviderMetadata } from '@bkpk/providers';
import { Exclude } from 'class-transformer';
import { Entity, Column, ManyToOne } from 'typeorm';

import BaseEntity from '~/entities/base.entity';

import BackpackEntity from './backpack.entity';

type ValueOf<T> = T[keyof T];

@Entity()
export default class AvatarEntity extends BaseEntity {
  @Column()
  uri: string;

  @Column()
  format: 'glb' | 'fbx' | 'vrm';

  @Column()
  type: 'humanoid';

  @Column()
  provider: keyof ProviderMetadata;

  @Column('simple-json')
  metadata: ValueOf<ProviderMetadata>;

  @ManyToOne(
    () => BackpackEntity,
    (backpack: BackpackEntity) => backpack.avatars,
    {
      primary: true,
      cascade: ['insert', 'update'],
    },
  )
  @Exclude()
  backpack: BackpackEntity;
}
