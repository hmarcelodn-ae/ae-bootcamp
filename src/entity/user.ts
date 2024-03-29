import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from './transaction';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    birthDate: Date;

    @Column()
    email: string;

    @Column()
    password: string;
    
    @Column()
    userIdentity: string;
}