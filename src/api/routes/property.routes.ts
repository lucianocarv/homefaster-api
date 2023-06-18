import { FastifyInstance } from 'fastify';
import { propertyController } from '../controllers/property.controller';

import schema from './swagger/property.swagger';

async function propertyRoutes(fastify: FastifyInstance) {
  fastify.post('/properties/search', { schema: schema.properties }, propertyController.properties);
  fastify.get('/properties/:id', { schema: schema.properties_id }, propertyController.getOneProperty);
  fastify.get('/properties/:id/images', { schema: schema.properties_id_image }, propertyController.getImages);
}

export { propertyRoutes };
