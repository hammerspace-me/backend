import { Column, Entity, OneToOne } from 'typeorm';

import ApplicationEntity from './application.entity';
import OAuthTokenEntity from './common/oauthToken.entity';

@Entity()
export default class RefreshTokenEntity extends OAuthTokenEntity {
  expirationTime = 30;

  @OneToOne(() => ApplicationEntity)
  @Column()
  clientId: string;
}
