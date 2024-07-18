import { Roles } from '@common/guards/RolesGuard/roles.decorator';
import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import type { CreateGameType } from '@modules/content/game/types/createGame.type';
import type { GetGamesType } from '@modules/content/game/types/getGames.type';
import type { UpdateGameTypeWithoutId } from '@modules/content/game/types/updateGame.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Game } from '@prisma/client';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get(':id')
  async getGame(@Param('id') id: number): Promise<Game> {
    return this.gameService.getGame(id);
  }

  @Get()
  async getGames(@Query() getGamesDto: GetGamesType): Promise<Game[]> {
    return this.gameService.getGames(getGamesDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createGame(@Body() createGameDto: CreateGameType): Promise<Game> {
    return this.gameService.createGame(createGameDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put('id')
  async updateGame(
    @Body() updatePersonDto: UpdateGameTypeWithoutId,
    @Param('id') id: number,
  ): Promise<Game> {
    return this.gameService.updateGame({ ...updatePersonDto, id: id });
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Delete(':id')
  async deleteGame(@Param('id') id: number): Promise<Game> {
    return this.gameService.deleteGame(id);
  }
}
