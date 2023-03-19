import { FastifyInstance, RouteOptions } from 'fastify';
import { communityController } from '../controllers/community-controller';

async function communityRoutesAuth(fastify: FastifyInstance) {
  fastify.post('/communities', communityController.createOneCommunity);
  fastify.post('/communities/image/upload/:id', communityController.uploadCoverImage);
  fastify.put('/communities/:id', communityController.update);
  fastify.delete('/communities/:id', communityController.delete);
}

export { communityRoutesAuth };
