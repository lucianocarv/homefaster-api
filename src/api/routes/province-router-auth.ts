import { FastifyInstance } from 'fastify';
import { provinceController } from '../controllers/province-controller.js';

async function provinceRoutesAuth(fastify: FastifyInstance) {
  fastify.post('/provinces', provinceController.createOneProvince);
  fastify.put('/provinces/:id', provinceController.updateOneProvince);
  fastify.delete('/provinces/:id', provinceController.delete);
  fastify.post('/provinces/image/upload/:id', provinceController.uploadImageForProvince);
}

export { provinceRoutesAuth };
