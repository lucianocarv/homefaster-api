import { FastifyInstance, RouteOptions } from 'fastify';
import { cityController } from '../controllers/city-controller';

async function cityRoutes(fastify: FastifyInstance, options: RouteOptions) {
  fastify.get('/cities', cityController.index);
  fastify.post('/cities', cityController.create);
  fastify.put('/cities/:id', cityController.update);
  fastify.delete('/cities/:id', cityController.delete);
}

export { cityRoutes };
