import { FastifyInstance } from 'fastify';
import { communityController } from '../controllers/community-controller';

async function communityRoutes(fastify: FastifyInstance) {
  fastify.get('/communities', communityController.getAllCommunities);
}

export { communityRoutes };
