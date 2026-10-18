import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from '../characters/character.entity';
import { Team } from './teams.entity';
import { TeamsService } from "./teams.service";
import { TeamsController } from "./teams.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Character, Team])],
    controllers: [TeamsController],
    providers: [TeamsService],
    exports: [TeamsService],
})
export class TeamsModule {}