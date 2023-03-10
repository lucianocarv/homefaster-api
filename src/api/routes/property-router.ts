import { FastifyInstance } from 'fastify';
import { propertyController } from '../controllers/property-controller';

async function propertyRoutes(fastify: FastifyInstance) {
  fastify.get('/properties/:id', propertyController.property);
  fastify.put('/properties/:id', propertyController.updateOneProperty);

  fastify.get('/properties', propertyController.index);
  fastify.get('/properties/search', propertyController.searchByAddress);
  fastify.post('/properties/filter', propertyController.filterByDescription);
  fastify.post('/properties', propertyController.create);
  fastify.post('/properties/image/upload/:id', propertyController.uploadThumbImage);
}

export { propertyRoutes };
