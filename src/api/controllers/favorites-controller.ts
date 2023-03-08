import { FastifyReply, FastifyRequest } from 'fastify';
import { IJWTPayload } from '../interfaces/jwt-payload';
import { favoritesService } from '../services/favorites-services';

const favoritesController = {
  favorites: async (req: FastifyRequest, res: FastifyReply) => {
    const { id: user_id } = req.user as IJWTPayload;
    try {
      const favorites = await favoritesService.favorites(user_id);
      res.send(favorites);
    } catch (error) {
      res.send(error);
    }
  },

  addFavorite: async (req: FastifyRequest, res: FastifyReply) => {
    const { id: user_id } = req.user as IJWTPayload;
    const { property_id } = req.body as { property_id: number };
    if (user_id) {
      try {
        const favorite = await favoritesService.addFavorite(property_id, user_id);
        return res.send(favorite);
      } catch (error) {
        return res.send(error);
      }
    }
  },

  removeFavorite: async (req: FastifyRequest, res: FastifyReply) => {
    const { id: user_id } = req.user as IJWTPayload;
    const { id } = req.body as { id: number };
    if (user_id) {
      try {
        const favoriteDeleted = await favoritesService.removeFavorite(id);
        return res.send(favoriteDeleted);
      } catch (error) {
        return res.send(error);
      }
    }
  },
};

export { favoritesController };
