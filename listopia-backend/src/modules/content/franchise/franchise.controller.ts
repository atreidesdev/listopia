import { Roles } from '@common/decorators/roles.decorator';

import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import type { CreateFranchiseType } from '@modules/content/franchise/types/createFranchise.type';
import type { GetFranchisesType } from '@modules/content/franchise/types/getFranchises.type';
import type { UpdateFranchiseTypeWithoutId } from '@modules/content/franchise/types/updateFranchise.type';
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
import {
  BookFranchise,
  Franchise,
  GameFranchise,
  GenreType,
  MovieFranchise,
} from '@prisma/client';
import { FranchiseService } from './franchise.service';

@Controller('franchise')
export class FranchiseController {
  constructor(private readonly franchiseService: FranchiseService) {}

  @Get(':id')
  async getFranchise(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Franchise> {
    return this.franchiseService.getFranchise(id);
  }

  @Get()
  async getFranchises(
    @Query() getFranchisesData: GetFranchisesType,
  ): Promise<Franchise[]> {
    return this.franchiseService.getFranchises(getFranchisesData);
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'developer', 'editor')
  @Post()
  async createFranchise(
    @Body() createFranchiseData: CreateFranchiseType,
  ): Promise<Franchise> {
    return this.franchiseService.createFranchise(createFranchiseData);
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'developer', 'editor')
  @Put(':id')
  async updateFranchise(
    @Body() updateFranchiseData: UpdateFranchiseTypeWithoutId,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Franchise> {
    return this.franchiseService.updateFranchise({
      ...updateFranchiseData,
      id: id,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'developer', 'editor')
  @Delete(':id')
  async deleteFranchise(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Franchise> {
    return this.franchiseService.deleteFranchise(id);
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'developer', 'editor')
  @Post(':id/content/:genreType/:contentId')
  async addToFranchise(
    @Param('id', ParseIntPipe) franchiseId: number,
    @Param('genreType') genreType: GenreType,
    @Param('contentId', ParseIntPipe) contentId: number,
  ): Promise<BookFranchise | MovieFranchise | GameFranchise> {
    return this.franchiseService.addToFranchise({
      contentId: contentId,
      franchiseId: franchiseId,
      genreType: genreType,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'developer', 'editor')
  @Delete(':id/content/:genreType/:contentId')
  async deleteFromFranchise(
    @Param('id', ParseIntPipe) franchiseId: number,
    @Param('genreType') genreType: GenreType,
    @Param('contentId', ParseIntPipe) contentId: number,
  ): Promise<BookFranchise | MovieFranchise | GameFranchise> {
    return this.franchiseService.deleteFromFranchise({
      contentId: contentId,
      franchiseId: franchiseId,
      genreType: genreType,
    });
  }
}
