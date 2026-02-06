import { Column, Entity, Unique } from 'typeorm';
import { AbstractBaseEntity } from '../base.entity';

@Entity({ name: 'carrier', schema: 'integration' })
@Unique(['provider', 'clientId'])
export class CarrierEntity extends AbstractBaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  clientId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  provider: string;

  @Column({ type: 'text', nullable: false })
  accessToken: string;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  accessTokenExpiresAt: Date;
}
