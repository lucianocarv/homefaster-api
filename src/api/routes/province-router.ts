import { FastifyInstance } from 'fastify';
import { provinceController } from '../controllers/province-controller.js';

async function provinceRoutes(fastify: FastifyInstance) {
  fastify.get('/provinces/:id', provinceController.getOneProvince);
  fastify.get('/provinces', provinceController.getAllProvinces);
}

export { provinceRoutes };
