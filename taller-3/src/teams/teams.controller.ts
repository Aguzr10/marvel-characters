import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CreateTeamDto, UpdateTeamDto, PatchTeamDto } from './dto';

@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar equipos',
    description: 'Lista todos los equipos, incluyendo sus personajes.',
  })
  @ApiOkResponse({ description: 'Lista de equipos obtenida exitosamente' })
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un equipo por ID',
    description: 'Obtiene un equipo por su id, incluyendo sus personajes.',
  })
  @ApiParam({ name: 'id', description: 'ID del equipo', type: Number })
  @ApiOkResponse({ description: 'Equipo obtenido exitosamente' })
  @ApiNotFoundResponse({ description: 'El equipo no existe (404)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.findOne(id);
  }

  @Get(':id/characters')
  @ApiOperation({
    summary: 'Listar los personajes de un equipo',
    description: 'Lista los personajes que pertenecen al equipo indicado.',
  })
  @ApiParam({ name: 'id', description: 'ID del equipo', type: Number })
  @ApiOkResponse({
    description: 'Lista de personajes del equipo obtenida exitosamente',
  })
  @ApiNotFoundResponse({ description: 'El equipo no existe (404)' })
  findCharacters(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.getCharacters(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un equipo',
    description:
      'Crea un nuevo equipo. Opcionalmente recibe characterIds para asignar personajes al equipo creado; el equipo debe estar activo y los personajes deben existir.',
  })
  @ApiCreatedResponse({ description: 'Equipo creado exitosamente (201)' })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o equipo inactivo con personajes (400)',
  })
  @ApiNotFoundResponse({
    description: 'Alguno de los personajes especificados no existe (404)',
  })
  @ApiConflictResponse({
    description: 'Ya existe un equipo con ese nombre (409)',
  })
  create(@Body() dto: CreateTeamDto) {
    return this.teamsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Reemplazar un equipo completo',
    description: 'Reemplaza todos los datos de un equipo existente.',
  })
  @ApiParam({ name: 'id', description: 'ID del equipo', type: Number })
  @ApiOkResponse({ description: 'Equipo reemplazado exitosamente (200)' })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o regla de negocio incumplida (400)',
  })
  @ApiNotFoundResponse({
    description: 'El equipo o algún personaje no existe (404)',
  })
  @ApiConflictResponse({
    description: 'Conflicto con nombre duplicado de otro equipo (409)',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTeamDto) {
    return this.teamsService.update(id, dto);
  }

  @Patch(':id/characters')
  @ApiOperation({
    summary: 'Asignar personajes a un equipo',
    description:
      'Asigna uno o varios personajes al equipo a partir de una lista de ids (characterIds). El equipo debe estar activo. Si un personaje ya pertenece a otro equipo, se reasigna al nuevo.',
  })
  @ApiParam({ name: 'id', description: 'ID del equipo', type: Number })
  @ApiOkResponse({ description: 'Personajes asignados exitosamente (200)' })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o equipo inactivo (400)',
  })
  @ApiNotFoundResponse({
    description: 'El equipo o algún personaje no existe (404)',
  })
  assignCharacters(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PatchTeamDto,
  ) {
    return this.teamsService.assignCharacters(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar un equipo',
    description:
      'Elimina un equipo por su id. No se puede eliminar si tiene personajes asignados.',
  })
  @ApiParam({ name: 'id', description: 'ID del equipo', type: Number })
  @ApiOkResponse({ description: 'Equipo eliminado exitosamente (200)' })
  @ApiNotFoundResponse({ description: 'El equipo no existe (404)' })
  @ApiConflictResponse({
    description: 'El equipo tiene personajes asignados (409)',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.remove(id);
  }
}
