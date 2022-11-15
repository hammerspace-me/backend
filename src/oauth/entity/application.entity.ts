import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Environment } from '../enum/environment.enum';

@Entity()
export default class ApplicationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Exclude()
  clientSecret: string;

  @Column()
  name: string;

  @Column()
  logo: string;

  @Column()
  banner: string;

  // TODO: This might be an array of redirect Uris in the future
  @Column()
  redirectUri: string;

  @Column('enum', { enum: Environment, default: Environment.prod })
  environment: Environment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
