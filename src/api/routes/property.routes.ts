import { FastifyInstance } from 'fastify';
import { propertyController } from '../controllers/property.controller';

async function propertyRoutes(fastify: FastifyInstance) {
  fastify.get('/properties/:id/images', propertyController.getImages);
  fastify.get('/properties/:id', propertyController.getOneProperty);
  fastify.get('/properties', propertyController.getAllProperties);
  fastify.post('/properties/search', propertyController.propertyFilter);
}

export { propertyRoutes };
