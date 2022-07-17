import { Column, Entity, OneToOne } from 'typeorm';
import ApplicationEntity from './application.entity';

import OAuthTokenEntity from './common/oauthToken.entity';

@Entity()
export default class RefreshTokenEntity extends OAuthTokenEntity {
  expirationTime = 52 * 7 * 24 * 60; // 1-year expiration

  @Column()
  state: string | null;

  @OneToOne(() => ApplicationEntity)
  @Column()
  clientId: string;
}
