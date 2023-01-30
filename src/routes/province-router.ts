import { FastifyInstance } from 'fastify';
import { provinceController } from '../controllers/province-controller.js';

async function provinceRoutes(fastify: FastifyInstance) {
  fastify.get('/provinces', provinceController.index);
  fastify.post('/provinces', provinceController.create);
}

export { provinceRoutes };
