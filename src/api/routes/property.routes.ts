import { FastifyInstance } from 'fastify';
import { propertyController } from '../controllers/property.controller';

import schema from './swagger/property.swagger';

async function propertyRoutes(fastify: FastifyInstance) {
  fastify.get('/properties/images', { schema: schema.properties_id_image }, propertyController.getImages);
  fastify.get('/properties/:id', { schema: schema.properties_id }, propertyController.getOneProperty);
  fastify.post('/properties/search', { schema: schema.properties_id_image }, propertyController.properties);
}

export { propertyRoutes };
