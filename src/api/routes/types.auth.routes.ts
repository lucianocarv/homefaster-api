import { FastifyInstance } from 'fastify';
import { typesController } from '../controllers/types.controller';

async function typesRoutesAuth(fastify: FastifyInstance) {
  fastify.get('/types', typesController.getAllTypes);
  fastify.post('/types', typesController.addType);
  fastify.delete('/types/:id', typesController.removeType);
}
export { typesRoutesAuth };
