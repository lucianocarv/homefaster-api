import { FastifyInstance } from 'fastify';
import { propertyController } from '../controllers/property.controller';
import schema from './swagger/property.swagger';

async function propertyRoutesAuth(fastify: FastifyInstance) {
  fastify.post('/properties', { schema: schema.properties_create }, propertyController.createOneProperty);
  fastify.post('/properties/:id/images', { schema: schema.property_image_upload }, propertyController.uploadImage);
  fastify.delete('/properties/:id/images', { schema: schema.property_image_delete }, propertyController.deleteImage);
  fastify.put('/properties/:id', { schema: schema.property_update }, propertyController.updateOneProperty);
  fastify.delete('/properties/:id', { schema: schema.property_delete }, propertyController.deleteOneProperty);
}

export { propertyRoutesAuth };
