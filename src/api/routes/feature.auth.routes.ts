import { FastifyInstance } from 'fastify';
import { featureController } from '../controllers/feature-controller';

async function featureRoutesAuth(fastify: FastifyInstance) {
  fastify.post('/features', featureController.createOneFeature);
  fastify.get('/features', featureController.findAll);
  fastify.put('/features/:id', featureController.updateOneFeature);
  fastify.delete('/features/:id', featureController.deleteOneFeature);
}
export { featureRoutesAuth };
