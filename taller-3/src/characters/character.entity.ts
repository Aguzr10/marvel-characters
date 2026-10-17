import { Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, JoinColumn, 
    CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Team } from '../teams/teams.entity';

@Entity('characters')
export class Character {
    @PrimaryGeneratedColumn() id: number;
    @Column({ name: 'real_name' }) realName: string;
    @Column() alias: string;
    @Column({ name: 'main_power' }) mainPower: string;
    @Column({ name: 'power_level' }) powerLevel: number;
    @Column() status: string;
    @Column({ name: 'is_villain' }) isVillain: boolean;

    @ManyToOne(() => Team, { nullable: true })
    @JoinColumn({ name: 'team_id' })
    team: Team;

    @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
    @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;

}