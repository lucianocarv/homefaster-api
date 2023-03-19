import { FastifyInstance, RouteOptions } from 'fastify';
import { cityController } from '../controllers/city-controller';

async function cityRoutesAuth(fastify: FastifyInstance) {
  fastify.post('/cities', cityController.createOneCity);
  fastify.post('/cities/image/upload/:id', cityController.uploadCoverImageForOneCity);
  fastify.put('/cities/:id', cityController.updateOneCity);
  fastify.delete('/cities/:id', cityController.delete);
}

export { cityRoutesAuth };
