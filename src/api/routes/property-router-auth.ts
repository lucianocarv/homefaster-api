import { FastifyInstance } from 'fastify';
import { propertyController } from '../controllers/property-controller';

async function propertyRoutesAuth(fastify: FastifyInstance) {
  fastify.post('/properties', propertyController.createOneProperty);
  fastify.post('/properties/image/upload/:id', propertyController.uploadThumbImage);
  fastify.put('/properties/:id', propertyController.updateOneProperty);
  fastify.delete('/properties/:id', propertyController.deleteOneProperty);
}

export { propertyRoutesAuth };
