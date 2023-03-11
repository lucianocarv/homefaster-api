import { FastifyInstance } from 'fastify';
import { propertyController } from '../controllers/property-controller';

async function propertyRoutes(fastify: FastifyInstance) {
  fastify.get('/properties/:id', propertyController.property);
  fastify.delete('/properties/:id', propertyController.delete);
  fastify.get('/properties', propertyController.index);
  fastify.post('/properties/search', propertyController.filter);
  fastify.post('/properties', propertyController.create);
  fastify.put('/properties/:id', propertyController.update);
  fastify.post('/properties/image/upload/:id', propertyController.uploadThumbImage);
}

export { propertyRoutes };
