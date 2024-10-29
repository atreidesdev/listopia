import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Roles } from '@common/decorators/roles.decorator';

import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import type { UserPayload } from '@modules/auth/types/user-payload.type';
import type { CreateMovieType } from '@modules/content/movie/types/createMovie.type';
import type { GetMoviesType } from '@modules/content/movie/types/getMovies.type';
import type { UpdateMovieTypeWithoutId } from '@modules/content/movie/types/updateMovie.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Movie } from '@prisma/client';
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get(':id')
  async getMovie(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserPayload,
    @Query('lang') lang?: string,
  ): Promise<Movie> {
    return this.movieService.getMovie({ id, userId: user?.id, lang });
  }

  @Get()
  async getMovies(
    @Query() getMoviesData: GetMoviesType,
    @Query('lang') lang?: string,
  ): Promise<Movie[]> {
    return this.movieService.getMovies({ ...getMoviesData, lang });
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'developer', 'editor')
  @Post()
  async createMovie(@Body() createMovieData: CreateMovieType): Promise<Movie> {
    return this.movieService.createMovie(createMovieData);
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'developer', 'editor')
  @Put('id')
  async updateMovie(
    @Body() updatePersonData: UpdateMovieTypeWithoutId,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Movie> {
    return this.movieService.updateMovie({ ...updatePersonData, id: id });
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'developer', 'editor')
  @Delete(':id')
  async deleteMovie(@Param('id', ParseIntPipe) id: number): Promise<Movie> {
    return this.movieService.deleteMovie(id);
  }
}
