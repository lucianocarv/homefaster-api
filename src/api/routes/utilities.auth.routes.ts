import { FastifyInstance } from 'fastify';
import { utilitiesController } from '../controllers/utilities.controller';

async function utilitiesRoutesAuth(fastify: FastifyInstance) {
  fastify.get('/utilities', utilitiesController.getAllUtilities);
  fastify.post('/utilities', utilitiesController.createUtility);
  fastify.put('/utilities/:id', utilitiesController.updateOneUtility);
  fastify.delete('/utilities/:id', utilitiesController.deleteOneUtility);
}
export { utilitiesRoutesAuth };
