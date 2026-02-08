import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('rounds')
export class Round {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    session_id!: string;

    @Column({
        default: 0
    })
    round!: number;

    @Column({
        type: 'varchar',
        length: 1,
        nullable: true

    })
    letter!: string;

    @Column()
    started_at!: Date;

    @Column({
        nullable: true
    })
    ended_at!: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at!: Date;
}
