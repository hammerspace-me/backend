import { Entity } from 'typeorm';

import OAuthTokenEntity from './common/oauthToken.entity';

@Entity()
export default class ActivationTokenEntity extends OAuthTokenEntity {
  expirationTime = 30;
  codeLength = 8;
  codeCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
}
