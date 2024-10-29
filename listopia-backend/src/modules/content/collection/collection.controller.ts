import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/JWTGuard/jwt-auth.guard';
import type { UserPayload } from '@modules/auth/types/user-payload.type';
import {
  CollectionType,
  CollectionUpdateType,
} from '@modules/content/collection/types/collection.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GenreType } from '@prisma/client';
import { CollectionService } from './collection.service';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get(':id')
  async getCollection(@Param('id', ParseIntPipe) id: number) {
    return this.collectionService.getCollection(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCollection(
    @Body() data: CollectionType,
    @CurrentUser() user: UserPayload,
  ) {
    return this.collectionService.createCollection({
      ...data,
      userId: user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateCollection(
    @Param('id', ParseIntPipe) collectionId: number,
    @Body() data: CollectionUpdateType,
    @CurrentUser() user: UserPayload,
  ) {
    return this.collectionService.updateCollection({
      ...data,
      collectionId,
      userId: user.id,
    });
  }

  @Get('user/:userId')
  async getCollectionsByUserId(@Param('userId') userId: number) {
    return this.collectionService.getCollectionsByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCollection(
    @Param('id', ParseIntPipe) collectionId: number,
    @CurrentUser() user: UserPayload,
  ) {
    return this.collectionService.deleteCollection({
      collectionId,
      userId: user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/:genreType/:contentId')
  async addItemToCollection(
    @Param('id', ParseIntPipe) collectionId: number,
    @Param('genreType') genreType: GenreType,
    @Param('contentId', ParseIntPipe) contentId: number,
    @CurrentUser() user: UserPayload,
  ) {
    return this.collectionService.addItemToCollection({
      collectionId,
      genreType,
      contentId,
      userId: user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/:genreType/:contentId')
  async deleteItemFromCollection(
    @Param('id', ParseIntPipe) collectionId: number,
    @Param('genreType') genreType: GenreType,
    @Param('contentId', ParseIntPipe) contentId: number,
    @CurrentUser() user: UserPayload,
  ) {
    return this.collectionService.deleteItemFromCollection({
      collectionId,
      genreType,
      contentId,
      userId: user.id,
    });
  }
}
