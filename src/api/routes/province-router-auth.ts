import { FastifyInstance } from 'fastify';
import { provinceController } from '../controllers/province-controller.js';

async function provinceRoutesAuth(fastify: FastifyInstance) {
  fastify.post('/provinces', provinceController.create);
  fastify.put('/provinces/:id', provinceController.update);
  fastify.delete('/provinces/:id', provinceController.delete);
  fastify.post('/provinces/image/upload/:id', provinceController.uploadImgCover);
}

export { provinceRoutesAuth };
