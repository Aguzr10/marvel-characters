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
  Query,
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
import { CharactersService } from './characters.service';
import {
  CreateCharacterDto,
  FilterCharactersDto,
  UpdateCharacterDto,
  UpdateCharacterStatusDto,
} from './dto';

@ApiTags('characters')
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar personajes',
    description:
      'Lista todos los personajes. Acepta filtros opcionales por query: ?status={status} y ?teamId={id}.',
  })
  @ApiOkResponse({ description: 'Lista de personajes obtenida exitosamente' })
  findAll(@Query() filters: FilterCharactersDto) {
    return this.charactersService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un personaje por ID',
    description:
      'Obtiene un personaje por su id, incluyendo los datos de su equipo.',
  })
  @ApiParam({ name: 'id', description: 'ID del personaje', type: Number })
  @ApiOkResponse({ description: 'Personaje obtenido exitosamente' })
  @ApiNotFoundResponse({ description: 'El personaje no existe (404)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.charactersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un personaje',
    description:
      'Crea un nuevo personaje. Si se envía team_id, el equipo debe existir y estar activo.',
  })
  @ApiCreatedResponse({ description: 'Personaje creado exitosamente (201)' })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o equipo inactivo (400)',
  })
  @ApiNotFoundResponse({
    description: 'El equipo especificado no existe (404)',
  })
  @ApiConflictResponse({
    description: 'Ya existe un personaje con ese alias (409)',
  })
  create(@Body() dto: CreateCharacterDto) {
    return this.charactersService.create(dto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Reemplazar un personaje completo',
    description: 'Reemplaza todos los datos de un personaje existente.',
  })
  @ApiParam({ name: 'id', description: 'ID del personaje', type: Number })
  @ApiOkResponse({ description: 'Personaje reemplazado exitosamente (200)' })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o regla de negocio incumplida (400)',
  })
  @ApiNotFoundResponse({ description: 'El personaje o equipo no existe (404)' })
  @ApiConflictResponse({
    description: 'Conflicto con alias duplicado de otro personaje (409)',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCharacterDto,
  ) {
    return this.charactersService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Cambiar estado del personaje',
    description:
      'Cambia únicamente el estado (status) del personaje. Un personaje RETIRED no puede pasar directamente a INJURED.',
  })
  @ApiParam({ name: 'id', description: 'ID del personaje', type: Number })
  @ApiOkResponse({ description: 'Estado actualizado exitosamente (200)' })
  @ApiBadRequestResponse({
    description:
      'Estado inválido o transición no permitida de RETIRED a INJURED (400)',
  })
  @ApiNotFoundResponse({ description: 'El personaje no existe (404)' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusDto: UpdateCharacterStatusDto,
  ) {
    return this.charactersService.updateStatus(id, statusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar un personaje',
    description: 'Elimina un personaje por su id.',
  })
  @ApiParam({ name: 'id', description: 'ID del personaje', type: Number })
  @ApiOkResponse({ description: 'Personaje eliminado exitosamente (200)' })
  @ApiNotFoundResponse({ description: 'El personaje no existe (404)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.charactersService.remove(id);
  }
}

