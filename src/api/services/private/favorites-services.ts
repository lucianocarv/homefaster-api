import { prisma } from '../../config/prisma-connect';

const favoritesService = {
  favorites: async (user_id: number) => {
    const favorites = await prisma.favorites.findMany({ where: { user_id } });
    return favorites;
  },

  addFavorite: async (property_id: number, user_id: number) => {
    const favorite = await prisma.favorites.create({
      data: { property_id, user_id },
    });
    return favorite;
  },

  removeFavorite: async (id: number) => {
    const favorite = await prisma.favorites.delete({ where: { id } });
    return favorite;
  },
};

export { favoritesService };
