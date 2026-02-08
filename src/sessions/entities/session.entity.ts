import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('sessions')
export class Group {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    access_code!: string;

    @Column()
    creator_id!: string;

    @Column({
        default: 3
    })
    total_rounds!: number;

    @Column({
        default: 0
    })
    current_round!: number;

    @Column({
        default: 45
    })
    round_timer!: number;

    @Column({
        nullable: true
    })
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
