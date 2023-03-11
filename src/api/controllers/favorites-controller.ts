import { FastifyReply, FastifyRequest } from 'fastify';
import { CustomError } from '../helpers/custom-error';
import { ICustomError } from '../interfaces/custom-error';
import { IJWTPayload } from '../interfaces/jwt-payload';
import { favoritesService } from '../services/favorites-services';

const favoritesController = {
  favorites: async (req: FastifyRequest, res: FastifyReply) => {
    const { id: user_id } = req.user as IJWTPayload;
    try {
      const favorites = await favoritesService.getAllFavorites(user_id);
      res.send(favorites);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  addFavorite: async (req: FastifyRequest, res: FastifyReply) => {
    const { id: user_id } = req.user as IJWTPayload;
    const { property_id } = req.body as { property_id: number };
    if (user_id) {
      try {
        const favorite = await favoritesService.addOneFavorite(property_id, user_id);
        return res.send(favorite);
      } catch (error) {
        const err = error as ICustomError;
        if (err.code) {
          return res.send(CustomError(err.code, err.message, err.statusCode));
        } else {
          return res.send(error);
        }
      }
    }
  },

  removeFavorite: async (req: FastifyRequest, res: FastifyReply) => {
    const { id: user_id } = req.user as IJWTPayload;
    const { id } = req.body as { id: number };
    if (user_id) {
      try {
        const favorite = await favoritesService.removeOneFavorite(id);
        return res.send(favorite);
      } catch (error) {
        const err = error as ICustomError;
        if (err.code) {
          return res.send(CustomError(err.code, err.message, err.statusCode));
        } else {
          return res.send(error);
        }
      }
    }
  },
};

export { favoritesController };
