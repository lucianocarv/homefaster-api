import { FastifyInstance } from 'fastify';
import { propertyController } from '../controllers/property-controller';

async function propertyRoutesAuth(fastify: FastifyInstance) {
  fastify.post('/properties', propertyController.create);
  fastify.post('/properties/image/upload/:id', propertyController.uploadThumbImage);
  fastify.put('/properties/:id', propertyController.update);
  fastify.delete('/properties/:id', propertyController.delete);
}

export { propertyRoutesAuth };
