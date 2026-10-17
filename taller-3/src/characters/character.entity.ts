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
  realName: string;

  @Column({ unique: true })
  alias: string;

  @Column({ name: 'main_power' })
  mainPower: string;

  @Column({ name: 'power_level' })
  powerLevel: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: CharacterStatus.ACTIVE,
  })
  status: CharacterStatus;

  @Column({ name: 'is_villain', default: false })
  isVillain: boolean;

  @ManyToOne(() => Team, (team) => team.characters, { nullable: true })
  @JoinColumn({ name: 'team_id' })
  team?: Team | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}