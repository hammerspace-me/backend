import { Entity, PrimaryColumn, CreateDateColumn, Column } from 'typeorm';

@Entity()
export class NonceEntity {
  @PrimaryColumn()
  nonce: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @Column()
  backpack: string;
}
