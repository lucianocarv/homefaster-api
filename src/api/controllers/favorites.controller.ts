import { Favorite } from '@prisma/client';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ERR_PERMISSION_DENIED } from '../errors/permission.errors';
import { JWTUserPayload } from '../interfaces/jwt-payload';
import { favoritesService } from '../services/favorites.services';
import { getPagination } from '../helpers/get-pagination';
import { PaginationParameters } from '../interfaces/pagination-parameters';
import { ERR_FAVORITE_ALREADY_EXISTS, ERR_FAVORITE_NOT_EXISTS } from '../errors/favorites.erros';
import { propertyServices } from '../services/property.services';
import { ERR_PROPERTY_NOT_FOUND } from '../errors/property.erros';

const favoritesController = {
  getAllFavorites: async (req: FastifyRequest, res: FastifyReply): Promise<Favorite[] | FastifyError> => {
    const { id: user_id } = req.user as JWTUserPayload;

    if (!user_id) throw ERR_PERMISSION_DENIED;

    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page) as PaginationParameters;

    try {
      const favorites = await favoritesService.getAllFavorites(user_id, { page_number, per_page_number, skip });
      return res.send(favorites);
    } catch (error) {
      return res.send(error);
    }
  },

  addOneFavorite: async (req: FastifyRequest, res: FastifyReply): Promise<Favorite | FastifyError> => {
    const { id: user_id } = req.user as JWTUserPayload;
    if (!user_id) throw ERR_PERMISSION_DENIED;
    const { id: property_id } = req.params as { id: number };

    try {
      // Verifica os dados obrigatórios para adicionar um favorito:
      const [favoriteExists, propertyExists] = await Promise.all([
        favoritesService.getFavoriteByUserAndProperty(Number(property_id), user_id),
        propertyServices.getOneProperty(Number(property_id))
      ]);
      if (favoriteExists) throw ERR_FAVORITE_ALREADY_EXISTS;
      if (!propertyExists) throw ERR_PROPERTY_NOT_FOUND;

      // Criar um favorito
      const favorite = await favoritesService.addOneFavorite(Number(property_id), user_id);
      return res.status(201).send(favorite);
    } catch (error) {
      return res.send(error);
    }
  },

  removeOneFavorite: async (req: FastifyRequest, res: FastifyReply): Promise<Favorite | FastifyError> => {
    const { id: user_id } = req.user as JWTUserPayload;

    if (!user_id) throw ERR_PERMISSION_DENIED;

    const { id } = req.params as { id: string };
    try {
      const favoriteExists = await favoritesService.getFavoriteById(Number(id));
      if (!favoriteExists) throw ERR_FAVORITE_NOT_EXISTS;

      const favorite = await favoritesService.removeOneFavorite(Number(id));
      return res.status(202).send(favorite);
    } catch (error) {
      return res.send(error);
    }
  }
};

export { favoritesController };
