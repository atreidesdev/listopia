import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Roles } from '@common/decorators/roles.decorator';

import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import type { UserPayload } from '@modules/auth/types/user-payload.type';
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
  async getGame(
    @Param('id') id: number,
    @CurrentUser() user: UserPayload,
    @Query('lang') lang?: string,
  ): Promise<Game> {
    return this.gameService.getGame({ id, userId: user?.id, lang });
  }

  @Get()
  async getGames(
    @Query() getGamesData: GetGamesType,
    @Query('lang') lang?: string,
  ): Promise<Game[]> {
    return this.gameService.getGames({ ...getGamesData, lang });
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'developer', 'editor')
  @Post()
  async createGame(@Body() createGameData: CreateGameType): Promise<Game> {
    return this.gameService.createGame(createGameData);
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'developer', 'editor')
  @Put('id')
  async updateGame(
    @Body() updatePersonData: UpdateGameTypeWithoutId,
    @Param('id') id: number,
  ): Promise<Game> {
    return this.gameService.updateGame({ ...updatePersonData, id: id });
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'developer', 'editor')
  @Delete(':id')
  async deleteGame(@Param('id') id: number): Promise<Game> {
    return this.gameService.deleteGame(id);
  }
}
