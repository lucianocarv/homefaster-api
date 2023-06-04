import { FastifyInstance } from 'fastify';
import { favoritesController } from '../controllers/favorites.controller';
import { cityController } from '../controllers/city.controller';

async function cityRoutes(fastify: FastifyInstance) {
  fastify.get('/cities/featured', cityController.getFeaturedCities);
}

export { cityRoutes };
