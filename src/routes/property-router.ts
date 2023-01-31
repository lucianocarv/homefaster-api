import { FastifyInstance } from 'fastify';
import { propertyController } from '../controllers/property-controller';

async function propertyRoutes(fastify: FastifyInstance) {
  fastify.post('/properties', propertyController.create);
}

export { propertyRoutes };
