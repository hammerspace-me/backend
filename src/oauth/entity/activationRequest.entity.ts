import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Scopes } from '../enum/scopes.enum';

@Entity()
export default class ActivationRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  state?: string;

  @Column()
  clientId: string;

  @Column({ nullable: true })
  owner: string;

  @Column({ nullable: true })
  redirectUri?: string;

  @Column()
  activationCode: string;

  @Column({ nullable: true })
  authorizationCode?: string;

  @Column('simple-array')
  scopes: Scopes[];

  @Column()
  expiration: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
