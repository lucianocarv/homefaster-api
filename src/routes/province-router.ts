import { FastifyInstance } from 'fastify';
import { provinceController } from '../controllers/province-controller.js';

async function provinceRoutes(fastify: FastifyInstance) {
  fastify.get('/provinces', provinceController.index);
  fastify.post('/provinces', provinceController.create);
  fastify.put('/provinces/:id', provinceController.update);
  fastify.delete('/provinces/:id', provinceController.delete);
}

export { provinceRoutes };
