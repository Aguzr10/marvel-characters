import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Character, CharacterStatus } from './character.entity';
import { Team } from '../teams/teams.entity';
import {
  CreateCharacterDto,
  FilterCharactersDto,
  UpdateCharacterDto,
  UpdateCharacterStatusDto,
} from './dto';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepo: Repository<Character>,
    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
  ) {}

  async findAll(filters?: FilterCharactersDto): Promise<Character[]> {
    const where: FindOptionsWhere<Character> = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.teamId) {
      where.team = { id: filters.teamId };
    }

    return await this.characterRepo.find({
      where,
      relations: { team: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Character> {
    const character = await this.characterRepo.findOne({
      where: { id },
      relations: { team: true },
    });

    if (!character) {
      throw new NotFoundException(`Personaje con id ${id} no encontrado`);
    }

    return character;
  }

  async create(dto: CreateCharacterDto): Promise<Character> {
    const real_name = dto.real_name ?? dto.realName;
    const alias = dto.alias;
    const main_power = dto.main_power ?? dto.mainPower;
    const power_level = dto.power_level ?? dto.powerLevel;
    const status = dto.status ?? CharacterStatus.ACTIVE;
    const is_villain = dto.is_villain ?? dto.isVillain ?? false;
    const team_id = dto.team_id !== undefined ? dto.team_id : dto.teamId;

    if (!real_name || !alias || !main_power || power_level === undefined) {
      throw new BadRequestException(
        'real_name, alias, main_power y power_level son obligatorios',
      );
    }

    // Regla 2: No pueden existir dos personajes con el mismo alias (409)
    const existingAlias = await this.characterRepo.findOne({ where: { alias } });
    if (existingAlias) {
      throw new ConflictException(
        `Ya existe un personaje con el alias '${alias}'`,
      );
    }

    // Regla 3: El power_level debe estar entre 1 y 100 y status debe ser válido (400)
    if (power_level < 1 || power_level > 100) {
      throw new BadRequestException('El power_level debe estar entre 1 y 100');
    }
    if (!Object.values(CharacterStatus).includes(status)) {
      throw new BadRequestException(
        `El status debe ser uno de: ${Object.values(CharacterStatus).join(', ')}`,
      );
    }

    // Regla 4: Si tiene team_id, el equipo debe existir (404) y estar activo (400)
    let team: Team | null = null;
    if (team_id !== null && team_id !== undefined) {
      team = await this.teamRepo.findOne({ where: { id: team_id } });
      if (!team) {
        throw new NotFoundException(`El equipo con id ${team_id} no existe`);
      }
      if (!team.active) {
        throw new BadRequestException(`El equipo con id ${team_id} no está activo`);
      }
    }

    const character = this.characterRepo.create({
      real_name,
      alias,
      main_power,
      power_level,
      status,
      is_villain,
      team: team ?? null,
    });

    return await this.characterRepo.save(character);
  }

  async update(id: number, dto: UpdateCharacterDto): Promise<Character> {
    // Regla 1: Si no existe, responder 404
    const character = await this.characterRepo.findOne({
      where: { id },
      relations: { team: true },
    });
    if (!character) {
      throw new NotFoundException(`Personaje con id ${id} no encontrado`);
    }

    // Regla 2: No pueden existir dos personajes con el mismo alias (409)
    if (dto.alias && dto.alias !== character.alias) {
      const existingAlias = await this.characterRepo.findOne({
        where: { alias: dto.alias },
      });
      if (existingAlias && existingAlias.id !== id) {
        throw new ConflictException(
          `Ya existe otro personaje con el alias '${dto.alias}'`,
        );
      }
      character.alias = dto.alias;
    }

    // Regla 3: El power_level debe estar entre 1 y 100 y status válido (400)
    const newPowerLevel = dto.power_level ?? dto.powerLevel;
    if (newPowerLevel !== undefined) {
      if (newPowerLevel < 1 || newPowerLevel > 100) {
        throw new BadRequestException('El power_level debe estar entre 1 y 100');
      }
      character.power_level = newPowerLevel;
    }

    if (dto.status) {
      if (!Object.values(CharacterStatus).includes(dto.status)) {
        throw new BadRequestException(
          `El status debe ser uno de: ${Object.values(CharacterStatus).join(', ')}`,
        );
      }
      // Regla 7: En RETIRED no puede pasar directamente a INJURED (400); sí puede volver a ACTIVE
      if (
        character.status === CharacterStatus.RETIRED &&
        dto.status === CharacterStatus.INJURED
      ) {
        throw new BadRequestException(
          'Un personaje en estado RETIRED no puede pasar directamente a INJURED',
        );
      }
      character.status = dto.status;
    }

    const newRealName = dto.real_name ?? dto.realName;
    if (newRealName !== undefined) character.real_name = newRealName;

    const newMainPower = dto.main_power ?? dto.mainPower;
    if (newMainPower !== undefined) character.main_power = newMainPower;

    const newIsVillain = dto.is_villain ?? dto.isVillain;
    if (newIsVillain !== undefined) character.is_villain = newIsVillain;

    // Regla 4: Al actualizar con team_id, debe existir (404) y estar activo (400)
    const newTeamId = dto.team_id !== undefined ? dto.team_id : dto.teamId;
    if (newTeamId !== undefined) {
      if (newTeamId === null) {
        character.team = null;
      } else {
        const team = await this.teamRepo.findOne({ where: { id: newTeamId } });
        if (!team) {
          throw new NotFoundException(`El equipo con id ${newTeamId} no existe`);
        }
        if (!team.active) {
          throw new BadRequestException(
            `El equipo con id ${newTeamId} no está activo`,
          );
        }
        character.team = team;
      }
    }

    return await this.characterRepo.save(character);
  }

  async updateStatus(
    id: number,
    statusDto: UpdateCharacterStatusDto,
  ): Promise<Character> {
    // Regla 1: Si no existe, responder 404
    const character = await this.characterRepo.findOne({
      where: { id },
      relations: { team: true },
    });
    if (!character) {
      throw new NotFoundException(`Personaje con id ${id} no encontrado`);
    }

    // Regla 3: El status debe ser uno de los valores válidos (400)
    if (!Object.values(CharacterStatus).includes(statusDto.status)) {
      throw new BadRequestException(
        `El status debe ser uno de: ${Object.values(CharacterStatus).join(', ')}`,
      );
    }

    // Regla 7: Un personaje en estado RETIRED no puede pasar directamente a INJURED (400); sí puede volver a ACTIVE
    if (
      character.status === CharacterStatus.RETIRED &&
      statusDto.status === CharacterStatus.INJURED
    ) {
      throw new BadRequestException(
        'Un personaje en estado RETIRED no puede pasar directamente a INJURED',
      );
    }

    character.status = statusDto.status;
    return await this.characterRepo.save(character);
  }

  async remove(id: number): Promise<{ message: string }> {
    // Regla 1: Si no existe, responder 404
    const character = await this.characterRepo.findOne({ where: { id } });
    if (!character) {
      throw new NotFoundException(`Personaje con id ${id} no encontrado`);
    }

    await this.characterRepo.remove(character);
    return { message: `Personaje con id ${id} eliminado exitosamente` };
  }
}

