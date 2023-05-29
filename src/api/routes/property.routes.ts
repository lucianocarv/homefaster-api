import { FastifyInstance } from 'fastify';
import { propertyController } from '../controllers/property.controller';

async function propertyRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/properties/:id/images',
    {
      schema: {
        description: 'Property',
        tags: ['properties']
      }
    },
    propertyController.getImages
  );
  fastify.get(
    '/properties/:id',
    {
      schema: {
        description: 'Property',
        tags: ['properties']
      }
    },
    propertyController.getOneProperty
  );
  fastify.get(
    '/properties',
    {
      schema: {
        description: 'Property',
        tags: ['properties']
      }
    },
    propertyController.getAllProperties
  );
  fastify.post(
    '/properties/search',
    {
      schema: {
        description: 'Property',
        tags: ['properties']
      }
    },
    propertyController.propertyFilter
  );
}

export { propertyRoutes };
