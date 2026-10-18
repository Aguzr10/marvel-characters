import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, 
         IsEnum, 
         IsInt,
         IsNotEmpty, 
         IsOptional, 
         IsString, 
         Max, 
         IsArray,
         ArrayUnique,
         Min
 } from "class-validator";
 
export class CreateTeamDto{
    @ApiProperty({description: "Nombre del equipo", example: "Los 4 fantasticos"})
    @IsString()
    @IsNotEmpty({message: "el nombre no puede estar vacio"})
    name: string;

    @ApiPropertyOptional({ example: 'Torre de los vengadores' })
    @IsString()
    @IsOptional()
    base?: string;

    @ApiProperty({description: "Año de fundacion del equipo", example: 2026})
    @IsInt()
    @IsOptional()
    foundedYear?: number;

    @ApiProperty({description: "Esta activo el equipo?", example: true})
    @IsBoolean()
    @IsNotEmpty({message: "el estado no puede estar vacio"})
    active: boolean;

    @ApiPropertyOptional({ description: 'Ids de personajes a asignar al equipo', example: [1, 2, 3] })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsInt({ each: true })
    characterIds?: number[];
}
