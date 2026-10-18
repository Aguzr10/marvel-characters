import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Team } from '../teams/teams.entity';

export enum CharacterStatus {
  ACTIVE = 'ACTIVE',
  INJURED = 'INJURED',
  MISSING = 'MISSING',
  RETIRED = 'RETIRED',
}

@Entity('characters')
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'real_name' })
  real_name: string;

  @Column({ unique: true })
  alias: string;

  @Column({ name: 'main_power' })
  main_power: string;

  @Column({ name: 'power_level' })
  power_level: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: CharacterStatus.ACTIVE,
  })
  status: CharacterStatus;

  @Column({ name: 'is_villain', default: false })
  is_villain: boolean;

  @Column({ name: 'team_id', nullable: true })
  team_id?: number | null;

  @ManyToOne(() => Team, (team) => team.characters, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'team_id' })
  team?: Team | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}