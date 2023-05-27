import { prisma } from '../config/prisma/prisma.config';
import { PaginationParameters } from '../interfaces/pagination-parameters';

const favoritesService = {
  getAllFavorites: async (user_id: number, { page_number, per_page_number, skip }: PaginationParameters) => {
    const [favorites, count] = await Promise.all([
      prisma.favorite.findMany({ where: { user_id }, skip, take: per_page_number }),
      prisma.favorite.count()
    ]);

    const pages = Math.ceil(count / per_page_number);

    return { count, page: page_number, per_page: per_page_number, pages, favorites };
  },

  addOneFavorite: async (property_id: number, user_id: number) => {
    const favorite = await prisma.favorite.create({
      data: { property_id, user_id }
    });
    return favorite;
  },

  getFavoriteByUserAndProperty: async (property_id: number, user_id: number) => {
    const favorite = await prisma.favorite.findUnique({
      where: {
        user_id_property_id: {
          property_id,
          user_id
        }
      }
    });
    if (favorite) {
      return favorite;
    } else {
      return false;
    }
  },

  getFavoriteById: async (id: number) => {
    const favorite = await prisma.favorite.findUnique({
      where: {
        id
      }
    });
    if (favorite) {
      return favorite;
    } else {
      return false;
    }
  },

  removeOneFavorite: async (id: number) => {
    const favorite = await prisma.favorite.delete({ where: { id } });
    return favorite;
  }
};

export { favoritesService };
