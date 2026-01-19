import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class Users {
	@PrimaryGeneratedColumn('uuid')
	// eslint-disable-next-line indent
	id!: string;

	@Column()
	username!: string;
}
