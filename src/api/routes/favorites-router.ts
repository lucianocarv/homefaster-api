import { FastifyInstance } from 'fastify';
import { favoritesController } from '../controllers/favorites-controller';

async function favoritesRouter(fastify: FastifyInstance) {
  fastify.get('/users/favorites', favoritesController.favorites);
  fastify.post('/users/favorites', favoritesController.addFavorite);
  fastify.delete('/users/favorites', favoritesController.removeFavorite);
}

export { favoritesRouter };
