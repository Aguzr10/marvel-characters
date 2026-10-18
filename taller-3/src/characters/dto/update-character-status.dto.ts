import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CharacterStatus } from '../character.entity';

export class UpdateCharacterStatusDto {
  @ApiProperty({
    description: 'Nuevo estado del personaje',
    enum: CharacterStatus,
    example: CharacterStatus.ACTIVE,
  })
  @IsEnum(CharacterStatus, {
    message: `status debe ser uno de los siguientes valores: ${Object.values(CharacterStatus).join(', ')}`,
  })
  @IsNotEmpty({ message: 'status no puede estar vacío' })
  status: CharacterStatus;
}
