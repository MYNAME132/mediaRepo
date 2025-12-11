import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('outbox')
export class Outbox {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    topic: string;

    @Column({ nullable: false })
    entity: string;

    @Column({
        type: 'jsonb',
        nullable: false,
    })
    data: JSON;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
