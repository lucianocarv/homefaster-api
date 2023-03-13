import { FastifyInstance } from 'fastify';
import { userController } from '../controllers/user-controller';

async function userRouterAuth(fastify: FastifyInstance) {
  fastify.get('/users/:id', userController.user);
  fastify.post('/users', userController.users);
  fastify.post('/users/register', userController.registerAuth);
  fastify.put('/users/update', userController.update);
}

export { userRouterAuth };
