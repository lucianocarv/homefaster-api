import { FastifyInstance } from 'fastify';
import { propertyController } from '../controllers/property-controller';

async function propertyRoutes(fastify: FastifyInstance) {
  fastify.get('/properties/:id', propertyController.property);
  fastify.get('/properties', propertyController.index);
  fastify.get('/properties/search', propertyController.searchByAddress);
  fastify.post('/properties/filter', propertyController.filterByDescription);
  fastify.post('/properties', propertyController.create);
}

export { propertyRoutes };
