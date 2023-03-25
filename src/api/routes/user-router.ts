import { FastifyInstance } from 'fastify';
import { userController } from '../controllers/user-controller';

async function userRouter(fastify: FastifyInstance) {
  fastify.post('/users/register', userController.register);
  fastify.post('/users/login', userController.login);
  fastify.post('/users/account/confirm', userController.confirmAccount);
}

export { userRouter };
