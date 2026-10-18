import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Team } from "./teams.entity";
import{
    CreateTeamDto,
    UpdateTeamDto,
    PatchTeamDto
} from "./dto";
import { Character } from '../characters/character.entity';

@Injectable()
export class TeamsService{
    constructor(
        @InjectRepository(Team)
        private readonly teamRepo: Repository<Team>,
        @InjectRepository(Character)
        private readonly characterRepo: Repository<Character>
    ) {}

    async findAll(): Promise<Team[]> {
    return await this.teamRepo.find({
        relations: {characters: true},
        order: {id: "ASC"},
        });
    }

    async findOne(id: number): Promise<Team> {
        const team = await this.teamRepo.findOne({
            where: { id },
            relations: { characters: true },
        });

        if (!team) {
            throw new NotFoundException(`El equipo con id ${id} no encontrado`);
        }

        return team;
    }

    async getCharacters(id: number): Promise<Character[]> {
        const team = await this.findOne(id);
        return team.characters;
    }

    private async findCharacters(ids: number[]): Promise<Character[]> {
        const characters = await this.characterRepo.find({
            where: { id: In(ids) },
        });

        if (characters.length !== ids.length) {
            const found = characters.map((c) => c.id);
            const missing = ids.filter((id) => !found.includes(id));
            throw new NotFoundException(
                `Personajes no encontrados: ${missing.join(', ')}`,
            );
        }

        return characters;
    }

    private async assignToTeam(team: Team, characters: Character[]): Promise<void> {
        characters.forEach((c) => (c.team = team));
        await this.characterRepo.save(characters);
    }

    async create(dto: CreateTeamDto): Promise<Team> {
        const name = dto.name;
        const base = dto.base;
        const foundedYear = dto.foundedYear;
        const characterIds = dto.characterIds;
        const active = dto.active ?? true;

        if (await this.teamRepo.findOne({ where: { name } })) {
            throw new ConflictException(`Ya existe un equipo con el nombre '${name}'`);
        }

        let characters: Character[] = [];
        if (characterIds?.length) {
            if (!active) {
                throw new BadRequestException(
                    'Un equipo inactivo no puede recibir personajes',
                );
            }
            characters = await this.findCharacters(characterIds);
        }

        const team = await this.teamRepo.save(
            this.teamRepo.create({ name, base, foundedYear, active }),
        );

        if (characters.length) {
            await this.assignToTeam(team, characters);
        }

        return this.findOne(team.id);
    }

    async assignCharacters(id: number, dto: PatchTeamDto): Promise<Team> {
        const team = await this.findOne(id); 

        if (!team.active) {
            throw new BadRequestException(
                `El equipo '${team.name}' está inactivo y no puede recibir personajes`,
            );
        }

        const characters = await this.findCharacters(dto.characterIds);
        await this.assignToTeam(team, characters);

        return this.findOne(id);
    }

    async update(id: number, dto: UpdateTeamDto): Promise<Team> {
        const team = await this.findOne(id);
        const name = dto.name;
        const base = dto.base;
        const foundedYear = dto.foundedYear;
        const active = dto.active ?? team.active;
        const characterIds = dto.characterIds;

        if (characterIds?.length) {
            if (!active) {
                throw new BadRequestException(
                    'Un equipo inactivo no puede recibir personajes',
                );
            }
            const characters = await this.findCharacters(characterIds);
            await this.assignToTeam(team, characters);
        }

        if (name !== team.name) {
            if (await this.teamRepo.findOne({ where: { name } })) {
                throw new ConflictException(`Ya existe un equipo con el nombre '${name}'`);
            }
            team.name = name;
        }
        if (base !== team.base) {
            team.base = base;
        }
        if (foundedYear !== team.foundedYear) {
            team.foundedYear = foundedYear;
        }
        if (active !== team.active) {
            team.active = active;
        }
        await this.teamRepo.save(team);
        return this.findOne(id);
    }

    async remove(id: number): Promise<{ message: string }> {
        const team = await this.findOne(id)
        if(team.characters.length > 0){
            throw new ConflictException("No se puede borrar un equipo que tenga miembros, para esto modifique el equipo y pongalo inactivo")
        }
        await this.teamRepo.remove(team);
        return { message: `Equipo '${team.name}' eliminado correctamente` };
    }
}