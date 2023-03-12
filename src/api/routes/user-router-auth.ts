import { FastifyInstance } from 'fastify';
import { userController } from '../controllers/user-controller';

async function userRouterAuth(fastify: FastifyInstance) {
  fastify.post('/users/register', userController.registerAuth);
}

export { userRouterAuth };
