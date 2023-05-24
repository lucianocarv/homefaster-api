import { prisma } from '../config/prisma/prisma-connect';
import { PaginationParameters } from '../interfaces/pagination-parameters';
import { propertyServices } from './property-services';

const favoritesService = {
  getAllFavorites: async (user_id: number, { page_number, per_page_number, skip }: PaginationParameters) => {
    const [favorites, count] = await Promise.all([
      prisma.favorite.findMany({ where: { user_id }, skip, take: per_page_number }),
      prisma.favorite.count()
    ]);

    const properties = await Promise.all(
      favorites.map(async favorite => {
        const property = await propertyServices.getOneProperty(favorite.property_id);
        return { favorite_id: favorite.id, property };
      })
    );

    const pages = Math.ceil(count / per_page_number);

    return { count, page: page_number, per_page: per_page_number, pages, favorites: properties };
  },

  addOneFavorite: async (property_id: number, user_id: number) => {
    const favorite = await prisma.favorite.create({
      data: { property_id, user_id }
    });
    return favorite;
  },

  removeOneFavorite: async (id: number) => {
    const favorite = await prisma.favorite.delete({ where: { id } });
    return favorite;
  }
};

export { favoritesService };
