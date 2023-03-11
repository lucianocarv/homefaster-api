import { FastifyInstance, RouteOptions } from 'fastify';
import { communityController } from '../controllers/community-controller';

async function communityRoutes(fastify: FastifyInstance, options: RouteOptions) {
  fastify.get('/communities', communityController.index);
  fastify.post('/communities', communityController.create);
  fastify.post('/communities/image/upload/:id', communityController.uploadCoverImage);
  fastify.put('/communities/:id', communityController.update);
  fastify.delete('/communities/:id', communityController.delete);
}

export { communityRoutes };
