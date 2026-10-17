import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Character } from '../characters/character.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  base?: string;

  @Column({ name: 'founded_year', nullable: true })
  foundedYear?: number;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Character, (character) => character.team)
  characters: Character[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}