import { ContentType } from '@prisma/client';

export type CreateGenreType = {
  name: string;
  description?: string;
  genreTypes: ContentType[];
};
