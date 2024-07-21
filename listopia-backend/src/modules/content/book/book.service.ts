import { FileUtil } from '@common/utils/file.util';
import type { CreateBookType } from '@modules/content/book/types/createBook.type';
import type { GetBooksType } from '@modules/content/book/types/getBooks.type';
import type { UpdateBookType } from '@modules/content/book/types/updateBook.type';
import { CastService } from '@modules/content/cast/cast.service';
import { Injectable } from '@nestjs/common';
import { Book, Prisma } from '@prisma/client';
import { PrismaService } from '@prismaPath/prisma.service';

@Injectable()
export class BookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUtil: FileUtil,
    private readonly castService: CastService,
  ) {}

  async getBook(id: number): Promise<Book> {
    const existingBook = this.prisma.book.findUnique({ where: { id: id } });

    if (!existingBook) {
      throw new Error('Book not found');
    }

    return existingBook;
  }

  async getBooks(getBooksData: GetBooksType): Promise<Book[]> {
    const { page, pageSize, sortField, sortOrder, genreIds, themeIds } =
      getBooksData;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    let orderBy: Prisma.BookOrderByWithRelationInput = {
      visitCount: 'desc',
    };

    if (sortField && sortOrder) {
      orderBy = { [sortField]: sortOrder };
    }

    return this.prisma.book.findMany({
      skip,
      take,
      orderBy,
      where: {
        AND: [
          genreIds ? { genres: { some: { id: { in: genreIds } } } } : undefined,
          themeIds ? { themes: { some: { id: { in: themeIds } } } } : undefined,
        ],
      },
    });
  }

  async createBook(createBookData: CreateBookType): Promise<Book> {
    const {
      title,
      description,
      poster,
      authors_ids,
      themes_ids,
      release,
      genres_ids,
      franchise_ids,
      cast,
      status,
      pageCount,
      ageRating,
    } = createBookData;

    let posterPath = '';
    if (poster) {
      posterPath = await this.fileUtil.saveFile({
        file: poster,
        filename: `${title}_${Date.now()}`,
        folder: 'book_posters',
      });
    }

    const book = await this.prisma.book.create({
      data: {
        title: title,
        description: description,
        posterPath: posterPath,
        release: release,
        status: status,
        pageCount: pageCount,
        ageRating: ageRating,
        authors: {
          connect: authors_ids.map((id) => ({ id })),
        },
        themes: {
          connect: themes_ids.map((id) => ({ id })),
        },
        genres: {
          connect: genres_ids.map((id) => ({ id })),
        },
        BookFranchise: {
          connect: franchise_ids.map((id) => ({ id })),
        },
      },
    });

    if (cast && cast.length > 0) {
      const updatedCast = cast.map((c) => ({ ...c, contentId: book.id }));
      await this.castService.createCastByArray(updatedCast);
    }

    return book;
  }

  async updateBook(updateBookData: UpdateBookType): Promise<Book> {
    const {
      id,
      title,
      description,
      poster,
      authors_ids,
      themes_ids,
      release,
      genres_ids,
      franchise_ids,
      cast,
      status,
      pageCount,
      ageRating,
    } = updateBookData;

    const existingBook = await this.prisma.book.findUnique({ where: { id } });
    if (!existingBook) {
      throw new Error('Book not found');
    }

    let posterPath = existingBook.posterPath;
    if (poster) {
      posterPath = await this.fileUtil.updateFile(
        poster,
        existingBook.posterPath,
        `${title}_${Date.now()}`,
        'book_posters',
      );
    }

    const updateData: any = {
      title: title,
      description: description,
      release: release,
      status: status,
      pageCount: pageCount,
      ageRating: ageRating,
    };

    if (posterPath) {
      updateData.posterPath = posterPath;
    }

    if (authors_ids) {
      updateData.authors = {
        set: authors_ids.map((id) => ({ id })),
      };
    }

    if (themes_ids) {
      updateData.themes = {
        set: themes_ids.map((id) => ({ id })),
      };
    }

    if (genres_ids) {
      updateData.genres = {
        set: genres_ids.map((id) => ({ id })),
      };
    }

    if (franchise_ids) {
      updateData.BookFranchise = {
        set: franchise_ids.map((id) => ({ id })),
      };
    }

    const book = await this.prisma.book.update({
      where: { id },
      data: updateData,
    });

    if (cast && cast.length > 0) {
      await this.castService.updateCastByArray(cast);
    }

    return book;
  }

  async deleteBook(id: number): Promise<Book> {
    return this.prisma.book.delete({ where: { id } });
  }
}