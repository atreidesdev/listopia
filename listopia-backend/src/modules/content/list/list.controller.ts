import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/JWTGuard/jwt-auth.guard';
import type { UserPayload } from '@modules/auth/types/user-payload.type';
import type {
  ListBookMaxPagesType,
  ListItemCurrentType,
  ListItemNoteType,
  ListItemRatingType,
  ListItemReviewType,
  ListItemType,
} from '@modules/content/list/types/listItem.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GenreType, ListItemStatus } from '@prisma/client';
import { ListService } from './list.service';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @UseGuards(JwtAuthGuard)
  @Put(':genreType/:contentId/note')
  async UpdateNote(
    @Param('genreType') genreType: GenreType,
    @Param('contentId') contentId: number,
    @Body()
    data: Omit<ListItemNoteType, 'userId' | 'genreType' | 'contentId'>,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.UpdateNote({
      ...data,
      userId,
      genreType,
      contentId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':genreType/:contentId/rating')
  async UpdateRating(
    @Param('genreType') genreType: GenreType,
    @Param('contentId') contentId: number,
    @Body()
    data: Omit<ListItemRatingType, 'userId' | 'genreType' | 'contentId'>,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.UpdateRating({
      ...data,
      userId,
      genreType,
      contentId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':genreType/:contentId/review')
  async UpdateReview(
    @Param('genreType') genreType: GenreType,
    @Param('contentId') contentId: number,
    @Body()
    data: Omit<ListItemReviewType, 'userId' | 'genreType' | 'contentId'>,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.UpdateReview({
      ...data,
      userId,
      genreType,
      contentId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':genreType/:contentId/current')
  async UpdateCurrent(
    @Param('genreType') genreType: GenreType,
    @Param('contentId') contentId: number,
    @Body()
    data: Omit<ListItemCurrentType, 'userId' | 'genreType' | 'contentId'>,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.UpdateCurrent({
      ...data,
      userId,
      genreType,
      contentId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':genreType/:contentId/maxPages')
  async UpdateMaxPages(
    @Param('genreType') genreType: GenreType,
    @Param('contentId') contentId: number,
    @Body()
    data: Omit<ListBookMaxPagesType, 'userId' | 'genreType' | 'contentId'>,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.UpdateMaxPages({
      ...data,
      userId,
      genreType,
      contentId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':genreType/:contentId')
  async addOrUpdateListItem(
    @Param('genreType') genreType: GenreType,
    @Param('contentId') contentId: number,
    @Body() data: Omit<ListItemType, 'userId' | 'genreType' | 'contentId'>,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.addOrUpdateListItem({
      ...data,
      userId,
      genreType,
      contentId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':genreType/:contentId')
  async deleteListItem(
    @Param('genreType') genreType: GenreType,
    @Param('contentId') contentId: number,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.deleteListItem({ userId, genreType, contentId });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllListItems(@CurrentUser() user: UserPayload) {
    const userId = user.id;
    return this.listService.getAllListItemsByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':genreType/:status')
  async getListItemsByTypeAndStatus(
    @Param('genreType') genreType: GenreType,
    @Param('status') status: ListItemStatus,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.getListItemsByTypeAndStatus({
      userId,
      genreType,
      status,
    });
  }
}
