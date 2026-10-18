import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { CharacterStatus } from '../character.entity';

export class CreateCharacterDto {
  @ApiProperty({ description: 'Nombre real del personaje', example: 'Tony Stark' })
  @IsString()
  @IsOptional()
  real_name?: string;

  @ApiPropertyOptional({ description: 'Nombre real (camelCase)', example: 'Tony Stark' })
  @IsString()
  @IsOptional()
  realName?: string;

  @ApiProperty({ description: 'Alias único del personaje', example: 'Iron Man' })
  @IsString()
  @IsNotEmpty({ message: 'alias no puede estar vacío' })
  alias: string;

  @ApiProperty({ description: 'Poder principal', example: 'Powered armor suit' })
  @IsString()
  @IsOptional()
  main_power?: string;

  @ApiPropertyOptional({ description: 'Poder principal (camelCase)', example: 'Powered armor suit' })
  @IsString()
  @IsOptional()
  mainPower?: string;

  @ApiProperty({ description: 'Nivel de poder (1-100)', example: 85, minimum: 1, maximum: 100 })
  @IsInt({ message: 'power_level debe ser un número entero' })
  @Min(1, { message: 'power_level debe estar entre 1 y 100' })
  @Max(100, { message: 'power_level debe estar entre 1 y 100' })
  @IsOptional()
  power_level?: number;

  @ApiPropertyOptional({ description: 'Nivel de poder (camelCase)', example: 85 })
  @IsInt()
  @Min(1, { message: 'powerLevel debe estar entre 1 y 100' })
  @Max(100, { message: 'powerLevel debe estar entre 1 y 100' })
  @IsOptional()
  powerLevel?: number;

  @ApiPropertyOptional({
    description: 'Estado del personaje',
    enum: CharacterStatus,
    default: CharacterStatus.ACTIVE,
  })
  @IsEnum(CharacterStatus, {
    message: `status debe ser uno de los siguientes valores: ${Object.values(CharacterStatus).join(', ')}`,
  })
  @IsOptional()
  status?: CharacterStatus;

  @ApiPropertyOptional({ description: 'Indica si es villano', default: false })
  @IsBoolean()
  @IsOptional()
  is_villain?: boolean;

  @ApiPropertyOptional({ description: 'Indica si es villano (camelCase)', default: false })
  @IsBoolean()
  @IsOptional()
  isVillain?: boolean;

  @ApiPropertyOptional({ description: 'ID del equipo al que pertenece', example: 1, nullable: true })
  @IsInt({ message: 'team_id debe ser un entero' })
  @IsOptional()
  team_id?: number | null;

  @ApiPropertyOptional({ description: 'ID del equipo (camelCase)', example: 1, nullable: true })
  @IsInt({ message: 'teamId debe ser un entero' })
  @IsOptional()
  teamId?: number | null;
}
