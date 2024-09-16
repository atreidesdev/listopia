import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/JWTGuard/jwt-auth.guard';
import type { UserPayload } from '@modules/auth/types/user-payload.type';
import { CreateCommentType } from '@modules/comments/types/createComment.type';
import { GetCommentsType } from '@modules/comments/types/getComments.type';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContentType } from '@prisma/client';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':contentType/:contentId')
  async createComment(
    @Param('contentType') contentType: string,
    @Param('contentId') contentId: number,
    @Body()
    createCommentData: Omit<
      CreateCommentType,
      'contentType' | 'contentId' | 'userId'
    >,
    @CurrentUser() user: UserPayload,
  ) {
    const data: CreateCommentType = {
      ...createCommentData,
      contentType: contentType as ContentType,
      contentId: contentId,
      userId: user.id,
    };
    return this.commentsService.createComment(data);
  }

  @Get(':contentType/:contentId')
  async getComments(
    @Param('contentType') contentType: string,
    @Param('contentId') contentId: number,
    @Query('page') page: number = 1,
  ) {
    const getCommentsData: GetCommentsType = {
      contentType: contentType as ContentType,
      contentId: contentId,
      page: page,
    };
    return this.commentsService.getComments(getCommentsData);
  }
}
