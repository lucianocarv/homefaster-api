import { FastifyInstance } from 'fastify';
import { featureController } from '../controllers/feature-controller';

async function featureRoutesAuth(fastify: FastifyInstance) {
  fastify.post('/features', featureController.createOneFeature);
  fastify.get('/features', featureController.findAll);
}
export { featureRoutesAuth };
