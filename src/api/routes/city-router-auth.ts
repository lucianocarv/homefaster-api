import { FastifyInstance, RouteOptions } from 'fastify';
import { cityController } from '../controllers/city-controller';

async function cityRoutesAuth(fastify: FastifyInstance) {
  fastify.post('/cities', cityController.create);
  fastify.post('/cities/image/upload/:id', cityController.uploadCoverImage);
  fastify.put('/cities/:id', cityController.update);
  fastify.delete('/cities/:id', cityController.delete);
}

export { cityRoutesAuth };
