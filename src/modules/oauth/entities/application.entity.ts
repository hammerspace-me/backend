import { Entity, Column, BeforeUpdate } from 'typeorm';

import BaseEntity from '~/entities/base.entity';
import { generateToken } from '~/utils/crypto';

@Entity()
export default class ApplicationEntity extends BaseEntity {
  @Column()
  clientSecret: string;

  @Column()
  name: string;

  @Column()
  logo: string;

  @Column()
  banner: string;

  @BeforeUpdate()
  async setClientSecret() {
    this.code = await generateToken();
  }
}
