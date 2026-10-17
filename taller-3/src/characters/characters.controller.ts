import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CharactersService } from './characters.service';

@Controller('characters')          // ruta base: /characters
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()                            // GET /characters
  findAll() {
    return this.charactersService.findAll();
  }

  @Get(':id')                       // GET /characters/5
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.charactersService.findOne(id);
  }
}
