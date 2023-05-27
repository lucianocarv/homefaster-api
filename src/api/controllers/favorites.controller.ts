import { Favorite } from '@prisma/client';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ERR_PERMISSION_DENIED } from '../errors/permission-erros';
import { CustomError } from '../helpers/custom-error';
import { ICustomError } from '../interfaces/custom-error';
import { IUserPayload } from '../interfaces/jwt-payload';
import { favoritesService } from '../services/favorites.services';
import { getPagination } from '../helpers/get-pagination';
import { PaginationParameters } from '../interfaces/pagination-parameters';

const favoritesController = {
  getAllFavorites: async (req: FastifyRequest, res: FastifyReply): Promise<Favorite[] | FastifyError> => {
    const { id: user_id } = req.user as IUserPayload;
    if (!user_id) throw ERR_PERMISSION_DENIED;
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page) as PaginationParameters;
    try {
      const favorites = await favoritesService.getAllFavorites(user_id, { page_number, per_page_number, skip });
      return res.send(favorites);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  addOneFavorite: async (req: FastifyRequest, res: FastifyReply): Promise<Favorite | FastifyError> => {
    const { id: user_id } = req.user as IUserPayload;
    const { property_id } = req.body as { property_id: number };
    if (!user_id) throw ERR_PERMISSION_DENIED;
    try {
      const favorite = await favoritesService.addOneFavorite(property_id, user_id);
      return res.status(201).send(favorite);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  removeOneFavorite: async (req: FastifyRequest, res: FastifyReply): Promise<Favorite | FastifyError> => {
    const { id: user_id } = req.user as IUserPayload;
    const { id } = req.body as { id: number };
    if (!user_id) throw ERR_PERMISSION_DENIED;
    try {
      const favorite = await favoritesService.removeOneFavorite(id);
      return res.status(202).send(favorite);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  }
};

export { favoritesController };
