import {
  Book,
  Collection,
  CollectionVisibility,
  Game,
  GenreType,
  Movie,
} from '@prisma/client';

export type CollectionWithItemsType = Collection & {
  books: Book[];
  movies: Movie[];
  games: Game[];
};

export type CollectionItem = {
  userId: number;
  collectionId: number;
  genreType: GenreType;
  contentId: number;
};

export type CollectionType = {
  userId: number;
  name: string;
  description?: string;
  poster?: Express.Multer.File;
};

export type CollectionUpdateType = {
  collectionId: number;
  userId: number;
  name?: string;
  description?: string;
  poster?: Express.Multer.File;
  visibility: CollectionVisibility;
};
