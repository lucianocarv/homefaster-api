import { FastifyInstance } from 'fastify';
import { propertyController } from '../controllers/property.controller';

async function propertyRoutesAuth(fastify: FastifyInstance) {
  fastify.post(
    '/properties',
    {
      schema: {
        description: 'Property',
        tags: ['properties']
      }
    },
    propertyController.createOneProperty
  );
  fastify.post(
    '/properties/input-validate',
    {
      schema: {
        description: 'Property',
        tags: ['properties']
      }
    },
    propertyController.validateEntriesToCreateAProperty
  );
  fastify.post(
    '/properties/images',
    {
      schema: {
        description: 'Property',
        tags: ['properties']
      }
    },
    propertyController.uploadImage
  );
  fastify.delete(
    '/properties/images',
    {
      schema: {
        description: 'Delete image of property',
        tags: ['properties']
      }
    },
    propertyController.deleteImage
  );
  fastify.put(
    '/properties/:id',
    {
      schema: {
        description: 'Property',
        tags: ['properties']
      }
    },
    propertyController.updateOneProperty
  );
  fastify.delete(
    '/properties/:id',
    {
      schema: {
        description: 'Property',
        tags: ['properties']
      }
    },
    propertyController.deleteOneProperty
  );
}

export { propertyRoutesAuth };
