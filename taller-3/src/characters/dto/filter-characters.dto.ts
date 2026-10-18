import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CharacterStatus } from '../character.entity';

export class FilterCharactersDto {
  @ApiPropertyOptional({
    description: 'Filtrar por estado del personaje',
    enum: CharacterStatus,
  })
  @IsOptional()
  @IsEnum(CharacterStatus, {
    message: `status debe ser uno de los siguientes valores: ${Object.values(CharacterStatus).join(', ')}`,
  })
  status?: CharacterStatus;

  @ApiPropertyOptional({
    description: 'Filtrar por ID del equipo al que pertenece el personaje',
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'teamId debe ser un número entero' })
  teamId?: number;
}
