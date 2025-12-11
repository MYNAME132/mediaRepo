
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

export enum MediaModelType {
    IMIAGE = 'Image',
    AUDIO = 'Audio',
    VIDEO = 'Video',
}

@Entity()
export class Media  {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column()
    name: string;

    @Column()
    type: string;

    @Index()
    @Column({
        type: 'uuid',
        nullable: true,
    })
    modelId?: string;

    @Column({
        type: 'enum',
        enum: MediaModelType,
        nullable: true,
    })
    modelType?: MediaModelType;

    @Column({nullable: true})
    organizationId: string;

    @Column({
        nullable: true,
        default: null,
    })
    link: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
