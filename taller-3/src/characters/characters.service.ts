import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from './character.entity';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly repo: Repository<Character>,
  ) {}

  findAll() {
    return this.repo.find({ relations: { team: true } });
  }

  async findOne(id: number) {
    const character = await this.repo.findOne({ where: { id }, relations: { team: true } });
    if (!character) throw new NotFoundException(`Character ${id} not found`);
    return character;
  }
}
