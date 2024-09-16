import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Roles } from '@common/decorators/roles.decorator';

import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import type { UserPayload } from '@modules/auth/types/user-payload.type';
import type { CreateBookType } from '@modules/content/book/types/createBook.type';
import type { GetBooksType } from '@modules/content/book/types/getBooks.type';
import type { UpdateBookTypeWithoutId } from '@modules/content/book/types/updateBook.type';
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
import { Book } from '@prisma/client';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get(':id')
  async getBook(
    @Param('id') id: number,
    @Query('lang') lang: string,
    @CurrentUser() user: UserPayload,
  ): Promise<Book> {
    return this.bookService.getBook({ id, userId: user?.id, lang });
  }

  @Get()
  async getBooks(
    @Query() getBooksData: GetBooksType,
    @Query('lang') lang?: string,
  ): Promise<Book[]> {
    return this.bookService.getBooks({ ...getBooksData, lang });
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'developer', 'editor')
  @Post()
  async createBook(@Body() createBookData: CreateBookType): Promise<Book> {
    return this.bookService.createBook(createBookData);
  }

  @Put(':id')
  async updateBook(
    @Param('id') id: number,
    @Body() updateBookData: UpdateBookTypeWithoutId,
  ): Promise<Book> {
    return this.bookService.updateBook({ ...updateBookData, id: id });
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'developer', 'editor')
  @Delete(':id')
  async deleteBook(@Param('id') id: number): Promise<Book> {
    return this.bookService.deleteBook(id);
  }
}
