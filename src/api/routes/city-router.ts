import { FastifyInstance } from 'fastify';
import { cityController } from '../controllers/city-controller';

async function cityRoutes(fastify: FastifyInstance) {
  fastify.get('/cities', cityController.getAllCities);
  fastify.get('/cities/:id', cityController.getOneCity);
}

export { cityRoutes };
