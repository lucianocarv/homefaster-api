import { FastifyInstance } from 'fastify';
import { propertyController } from '../controllers/property-controller';

async function propertyRoutes(fastify: FastifyInstance) {
  fastify.get('/properties/:id', propertyController.property);
  fastify.get('/properties', propertyController.index);
  fastify.post('/properties/search', propertyController.filter);
}

export { propertyRoutes };
