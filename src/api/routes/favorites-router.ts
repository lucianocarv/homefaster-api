import { FastifyInstance } from 'fastify';
import { favoritesController } from '../controllers/favorites-controller';

async function favoritesRouter(fastify: FastifyInstance) {
  fastify.get('/user/favorites', favoritesController.favorites);
  fastify.post('/user/favorites', favoritesController.addFavorite);
  fastify.delete('/user/favorites', favoritesController.removeFavorite);
}

export { favoritesRouter };
