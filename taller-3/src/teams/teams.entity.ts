import { Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, JoinColumn, 
    CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity('teams')
export class Team {
    @PrimaryGeneratedColumn() id: number;
    @Column() name: string;
    @Column() base: string;
    @Column({ name: 'founded_year' }) foundedYear: number;
    @Column() active: boolean;
    @Column({ name: 'created_at' }) createdAt: Date;
    @Column({ name: 'updated_at' }) updatedAt: Date;

}