import { FastifyInstance, RouteOptions } from 'fastify';
import { cityController } from '../controllers/city-controller';

async function cityRoutes(fastify: FastifyInstance) {
  fastify.get('/cities', cityController.index);
  fastify.get('/cities/:id', cityController.city);
}

export { cityRoutes };
