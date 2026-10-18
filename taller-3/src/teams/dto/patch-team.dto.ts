import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, 
         IsEnum, 
         IsInt,
         IsNotEmpty, 
         IsOptional, 
         IsString,
         IsArray,
         Max, 
         Min,
         ArrayNotEmpty,
         ArrayUnique
 } from "class-validator";

export class PatchTeamDto{
    @ApiProperty({description: "Id de los personajes", example: [1, 2, 3]})
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsInt({each: true})
    characterIds: number[];
    
}