import { FastifyInstance } from 'fastify';
import { favoritesController } from '../controllers/favorites.controller';

async function favoritesRouter(fastify: FastifyInstance) {
  fastify.get('/users/favorites', favoritesController.getAllFavorites);
  fastify.post('/users/favorites/:id', favoritesController.addOneFavorite);
  fastify.delete('/users/favorites/:id', favoritesController.removeOneFavorite);
}

export { favoritesRouter };
