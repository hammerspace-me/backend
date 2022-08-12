import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Scopes } from '../enum/scopes.enum';

@Entity()
export default class AuthorizationRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clientId: string;

  @Column()
  owner: string;

  @Column()
  expiration: number;

  @Column()
  authorizationCode: string;

  @Column('enum', { array: true, enum: Scopes, default: [] })
  scopes: Scopes[];

  @Column()
  state: string | null;

  @Column({ default: true })
  valid: boolean;

  @Column({ default: false })
  confirmed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
