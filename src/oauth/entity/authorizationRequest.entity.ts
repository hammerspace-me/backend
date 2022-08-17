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
  responseType: string;

  @Column()
  clientId: string;

  @Column()
  owner: string;

  @Column({ nullable: true })
  authorizationCode?: string;

  @Column('enum', { array: true, enum: Scopes, default: [] })
  scopes: Scopes[];

  @Column({ nullable: true })
  state?: string;

  @Column({ default: true })
  valid: boolean;

  @Column({ default: false })
  confirmed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
